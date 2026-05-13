import re

# --- CSS cleanup ---
with open('css/styles.css', 'r') as f:
    lines = f.readlines()

# Phase 1: remove layout margin lines (in reverse order to preserve indices)
lines_to_remove = set()

# Line 86: .features { margin-top: 40px; }
# Line 103: .features { margin-top: 30px; }
# Line 117: .features { margin-top: 20px; }

for i, line in enumerate(lines):
    stripped = line.strip()
    if stripped == '.features       { margin-top: 40px; }':
        lines_to_remove.add(i)
    elif stripped == '.features       { margin-top: 30px; }':
        lines_to_remove.add(i)
    elif stripped == '.features       { margin-top: 20px; }':
        lines_to_remove.add(i)

# Update the comment on the line before cases-wrapper
for i, line in enumerate(lines):
    if '/* Features → Cases wrapper */' in line:
        lines[i] = line.replace('/* Features → Cases wrapper */', '/* → Cases wrapper */')
        break

# Phase 2: Remove the entire FEATURES & BENEFITS block (from "FEATURES & BENEFITS — SLIDER" to end of file)
cut_start = None
for i, line in enumerate(lines):
    if 'FEATURES & BENEFITS — SLIDER' in line:
        cut_start = i - 1  # include the blank line before the comment
        break

if cut_start is not None:
    # Remove from cut_start to end
    lines = lines[:cut_start]
else:
    print('WARNING: Could not find FEATURES & BENEFITS block start')

# Remove the layout margin lines (in reverse order)
filtered = []
for i, line in enumerate(lines):
    if i not in lines_to_remove:
        filtered.append(line)
lines = filtered

with open('css/styles.css', 'w') as f:
    f.writelines(lines)

print(f'CSS: Removed {len(lines_to_remove)} layout lines + features block from line {cut_start}.')
print(f'CSS: New file length = {len(lines)} lines.')
