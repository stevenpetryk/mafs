require 'fileutils'

FOLDERS = [
  'animation',
  'display',
  'examples',
  'interaction'
]

# Iterate over all .tsx files in the directories
FOLDERS.each do |folder|
  Dir.glob("guides/#{folder}/**/*.tsx").each do |file|
    puts file
    content = File.read(file)

    # Replace the <GuidesLayout ...> JSX tag and closing tag with a react fragment
    content.gsub!(/<GuidesLayout.*?>/, '<>')
    content.gsub!(/<\/GuidesLayout>/, '</>')

    # Remove the GuideLayout import (wildcard location)
    content.gsub!(/import.*GuidesLayout.*".*GuidesLayout"/, '')
    # Remove the Guide import (wildcard location)
    content.gsub!(/import.*Guide.*".*guide"/, '')


    File.write(file, content)
  end
end
