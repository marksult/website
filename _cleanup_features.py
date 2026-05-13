import re

with open('index.html', 'r') as f:
    content = f.read()

pattern = r'\n  <!-- =================== FEATURES & BENEFITS.*?<script src="assets/js/features-slider\.js"></script>\n'
replacement = '\n  <!-- Features Benefits slider will be rebuilt here -->\n'
new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)

with open('index.html', 'w') as f:
    f.write(new_content)
print('HTML: Features section removed.')
