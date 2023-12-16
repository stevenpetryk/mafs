# Iterate over every .tsx file in docs/components/guide-examples and add 'use client' with a newline to the top of each

require 'fileutils'

Dir.glob('docs/components/guide-examples/**/*.tsx') do |file|
  File.write(file, "'use client'" + "\n" + File.read(file))
end
