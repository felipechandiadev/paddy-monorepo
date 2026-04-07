#!/usr/bin/env python3
import re
import json
from pathlib import Path

def parse_sql_insert(sql_file_path):
    """
    Parses a SQL dump file and extracts all INSERT statements,
    converting them to JSON structure.
    """
    
    with open(sql_file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Dictionary to store all tables and their data
    all_data = {}
    
    # Find all INSERT statements
    # Pattern: INSERT INTO `table_name` VALUES (...)(...)(...)...;
    insert_pattern = r"INSERT INTO `(\w+)` VALUES\s*((?:\([^)]*(?:['\"].*?['\"][^)]*)*\)[,;]?\s*)+)"
    
    for match in re.finditer(insert_pattern, content, re.DOTALL):
        table_name = match.group(1)
        values_block = match.group(2)
        
        if table_name not in all_data:
            all_data[table_name] = []
        
        # Extract individual row tuples: (...)
        # Split by ),( to separate rows
        row_pattern = r'\(([^)]*(?:\'[^\']*\'[^)]*|"[^"]*"[^)]*)*)\)'
        
        for row_match in re.finditer(row_pattern, values_block):
            row_content = row_match.group(1)
            if row_content.strip():
                # Parse individual values
                values = parse_values(row_content)
                if values:
                    all_data[table_name].append(values)
    
    return all_data

def parse_values(value_str):
    """
    Parse a comma-separated string of SQL values into a list.
    Handles NULL, strings (with quotes), numbers, JSON objects, and nested structures.
    """
    values = []
    current = ""
    in_string = False
    string_char = None
    brace_depth = 0
    
    i = 0
    while i < len(value_str):
        char = value_str[i]
        
        # Handle string boundaries
        if char in ('"', "'") and (i == 0 or value_str[i-1] != '\\'):
            if not in_string:
                in_string = True
                string_char = char
                current += char
            elif char == string_char:
                in_string = False
                current += char
                string_char = None
            else:
                current += char
        elif in_string:
            current += char
        elif char == '{':
            # Start of JSON object
            brace_depth += 1
            current += char
        elif char == '}':
            # End of JSON object
            brace_depth -= 1
            current += char
        elif char == ',' and brace_depth == 0 and not in_string:
            # This is a field delimiter
            values.append(clean_value(current.strip()))
            current = ""
        else:
            current += char
        
        i += 1
    
    # Don't forget the last value
    if current.strip():
        values.append(clean_value(current.strip()))
    
    return values

def clean_value(value):
    """
    Clean and convert a SQL value to appropriate Python type.
    """
    value = value.strip()
    
    # NULL
    if value.upper() == 'NULL':
        return None
    
    # Numbers (including decimals)
    if re.match(r'^-?\d+(\.\d+)?$', value):
        if '.' in value:
            return float(value)
        return int(value)
    
    # JSON objects
    if value.startswith('{') and value.endswith('}'):
        try:
            return json.loads(value)
        except:
            return value
    
    # Strings (remove quotes and decode escape sequences)
    if (value.startswith('"') and value.endswith('"')) or \
       (value.startswith("'") and value.endswith("'")):
        # Remove outer quotes
        value = value[1:-1]
        # Decode common escape sequences
        value = value.replace("\\'", "'")
        value = value.replace('\\"', '"')
        value = value.replace('\\\\', '\\')
        return value
    
    # Fallback - return as string
    return value

def main():
    sql_file = Path('/Users/felipe/dev/paddy/backend/mysql-restore-dump-20260320-010253.sql')
    
    print("Parsing SQL file...")
    data = parse_sql_insert(str(sql_file))
    
    # Create output JSON with table data
    output = {
        "database": "defaultdb",
        "timestamp": "2026-03-20T01:03:33",
        "tables": {}
    }
    
    # Sort tables alphabetically for better organization
    for table_name in sorted(data.keys()):
        rows = data[table_name]
        output["tables"][table_name] = {
            "rowCount": len(rows),
            "data": rows
        }
        print(f"✓ {table_name}: {len(rows)} rows")
    
    # Save to JSON file
    output_file = Path('/Users/felipe/dev/paddy/backend/database_dump.json')
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=2, ensure_ascii=False)
    
    print(f"\n✓ JSON saved to: {output_file}")
    print(f"Total tables: {len(output['tables'])}")
    print(f"Total rows: {sum(t['rowCount'] for t in output['tables'].values())}")

if __name__ == '__main__':
    main()
