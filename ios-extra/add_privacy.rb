# Adds the app's privacy manifest to the Xcode project (Apple requires PrivacyInfo.xcprivacy).
require 'xcodeproj'
require 'fileutils'
FileUtils.cp(File.join(__dir__, 'PrivacyInfo.xcprivacy'), 'ios/App/App/PrivacyInfo.xcprivacy')
p = Xcodeproj::Project.open('ios/App/App.xcodeproj')
t = p.targets.find { |x| x.name == 'App' }
g = p.main_group['App'] || p.main_group
unless g.files.any? { |f| f.path == 'PrivacyInfo.xcprivacy' }
  ref = g.new_reference('PrivacyInfo.xcprivacy')
  t.resources_build_phase.add_file_reference(ref)
end
p.save
puts 'Privacy manifest added'
