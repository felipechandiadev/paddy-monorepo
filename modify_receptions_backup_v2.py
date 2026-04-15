#!/usr/bin/env python3
import re

def modify_receptions_finalnetweight(input_file, output_file, new_value="27645.00"):
    """
    Modify all finalNetWeight values in receptions table INSERT statements
    """
    print(f"Reading {input_file}...")

    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()

    print(f"Original file size: {len(content)} characters")

    modified_count = 0

    # Simple approach: use regex to replace the 19th field in receptions INSERT statements
    # The pattern looks for: INSERT INTO `receptions` VALUES (...'value'...18 times...,)'old_value'(,...)

    # More precisely, let's find all occurrences of the finalNetWeight field in receptions
    # Since it's the 19th field, we can use a regex that matches 18 commas followed by the value

    def replace_field(match):
        nonlocal modified_count
        before = match.group(1)
        old_value = match.group(2)
        after = match.group(3)
        modified_count += 1
        print(f"Modified reception {modified_count}: {old_value} -> {new_value}")
        return before + new_value + after

    # Pattern: in receptions INSERT lines, find sequences like: ,number, where it's the 19th field
    # This is tricky. Let's use sed-like field replacement.

    # Actually, let's use a simpler approach: replace all occurrences of the pattern in receptions lines
    lines = content.split('\n')
    modified_lines = []

    for line in lines:
        if 'INSERT INTO `receptions`' in line:
            # This is a receptions INSERT line
            # Use regex to replace the finalNetWeight field
            # Pattern: replace the 18th comma-separated value that looks like a number

            # Let's count commas and replace the 19th field (0-based index 18)
            # But this is complex with quoted strings. Let's use a different approach.

            # Replace all numeric values in the finalNetWeight position using a more specific pattern
            # The finalNetWeight is always a decimal number like 12345.67

            # Pattern: replace , followed by digits.digits , in receptions context
            # But to be more precise, let's find the VALUES part and process it

            values_match = re.search(r'VALUES\s*\((.+)\)\s*;', line)
            if values_match:
                values_content = values_match.group(1)

                # Split by '),(' to get rows
                rows = re.split(r'\)\s*,\s*\(', values_content)

                modified_rows = []
                for row in rows:
                    # Split by comma, but handle quoted strings
                    fields = split_quoted_csv(row)

                    if len(fields) >= 19:
                        # The finalNetWeight is field 18 (0-based)
                        old_value = fields[18].strip("'\"")
                        if old_value.replace('.', '').replace('-', '').isdigit():  # It's a number
                            fields[18] = f"'{new_value}'"
                            modified_count += 1
                            print(f"Modified reception {modified_count}: {old_value} -> {new_value}")

                    modified_rows.append(','.join(fields))

                # Reconstruct the line
                modified_values = '(' + '),( '.join(modified_rows) + ')'
                modified_line = line.replace(values_match.group(0), f'VALUES {modified_values};')
                modified_lines.append(modified_line)
            else:
                modified_lines.append(line)
        else:
            modified_lines.append(line)

    # Write the modified content
    modified_content = '\n'.join(modified_lines)
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(modified_content)

    print(f"Modified {modified_count} reception records")
    print(f"Modified file written to {output_file}")
    print(f"New file size: {len(modified_content)} characters")


def split_quoted_csv(row):
    """
    Split a comma-separated row handling quoted strings
    """
    fields = []
    current = ""
    in_quotes = False
    quote_char = None

    i = 0
    while i < len(row):
        char = row[i]

        if not in_quotes:
            if char in ("'", '"'):
                in_quotes = True
                quote_char = char
                current += char
            elif char == ',':
                fields.append(current)
                current = ""
            else:
                current += char
        else:
            current += char
            if char == quote_char:
                # Check if escaped
                if i + 1 < len(row) and row[i + 1] == quote_char:
                    # Escaped quote, continue
                    i += 1
                else:
                    in_quotes = False
                    quote_char = None

        i += 1

    if current:
        fields.append(current)

    return fields


if __name__ == "__main__":
    input_file = "/Users/felipe/dev/paddy/backend/backups-aiven/backup-aiven-20260415-064235.sql"
    output_file = "/Users/felipe/dev/paddy/backend/backups-aiven/backup-aiven-20260415-064235-modified.sql"

    modify_receptions_finalnetweight(input_file, output_file, "27645.00")