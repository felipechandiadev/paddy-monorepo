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

    # Pattern to match INSERT INTO receptions VALUES statements
    # This will match the entire INSERT statement for receptions table
    receptions_pattern = r'(INSERT INTO `receptions` VALUES\s*\((?:\([^)]*(?:\'[^\']*\'[^)]*|"[^"]*"[^)]*)*\)[,;]?\s*)+?\);)'

    modified_count = 0

    def replace_finalnetweight(match):
        nonlocal modified_count
        insert_statement = match.group(1)

        # Find all row tuples within this INSERT statement
        row_pattern = r'\(([^)]*(?:\'[^\']*\'[^)]*|"[^"]*"[^)]*)*)\)'

        def modify_row(row_match):
            nonlocal modified_count
            row_content = row_match.group(1)

            # Split by comma, but be careful with commas inside strings
            # This is a simplified approach - split by comma and handle NULL specially
            parts = []
            current_part = ""
            in_string = False
            string_char = None

            for char in row_content:
                if not in_string:
                    if char in ("'", '"'):
                        in_string = True
                        string_char = char
                        current_part += char
                    elif char == ',':
                        parts.append(current_part.strip())
                        current_part = ""
                    else:
                        current_part += char
                else:
                    current_part += char
                    if char == string_char and current_part[-2] != '\\':  # Not escaped
                        in_string = False
                        string_char = None

            # Add the last part
            if current_part.strip():
                parts.append(current_part.strip())

            # The finalNetWeight is the 19th field (0-based index 18)
            if len(parts) >= 19:
                old_value = parts[18]
                parts[18] = new_value
                modified_count += 1
                print(f"Modified reception {modified_count}: {old_value} -> {new_value}")

            # Reconstruct the row
            return '(' + ','.join(parts) + ')'

        # Apply modification to all rows in this INSERT statement
        modified_insert = re.sub(row_pattern, modify_row, insert_statement)

        return modified_insert

    # Apply the modification
    modified_content = re.sub(receptions_pattern, replace_finalnetweight, content, flags=re.DOTALL)

    print(f"Modified {modified_count} reception records")

    # Write the modified content
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(modified_content)

    print(f"Modified file written to {output_file}")
    print(f"New file size: {len(modified_content)} characters")

if __name__ == "__main__":
    input_file = "/Users/felipe/dev/paddy/backend/backups-aiven/backup-aiven-20260415-064235.sql"
    output_file = "/Users/felipe/dev/paddy/backend/backups-aiven/backup-aiven-20260415-064235-modified.sql"

    modify_receptions_finalnetweight(input_file, output_file, "27645.00")