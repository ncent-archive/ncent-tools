require 'aws-sdk-ses'
require 'csv'
require 'json'
require_relative 'config'
require_relative '../utils/utils'

$client = Aws::SES::Client.new(region: 'us-west-2')

def generate_bulk_template
  {
    source: $config[:from],
    template: $config[:template_name],
    destinations: [],
    default_template_data: {
      first_name: $config[:default_first_name],
      last_name: $config[:default_last_name]
    }.to_json
  }
end

def construct_destination(recipient)
  {
    destination: {
      to_addresses: [ recipient[:email] ],
      cc_addresses: $config[:cc_addresses],
      bcc_addresses: $config[:bcc_addresses],
    },
    replacement_template_data: {
      first_name: recipient[:first_name],
      last_name: recipient[:last_name]
    }.to_json
  }
end

def construct_bulk_templates()
  recipients = csv_to_array
  bulk_templates = []
  bulk_template = nil # Needed scope. Ruby doesn't allow dec without init
  recipients.each_with_index do |recipient, i|
    if (i % $config[:throttle_rate] == 0)
      bulk_template = generate_bulk_template
      bulk_templates << bulk_template
    end
    bulk_template[:destinations] << construct_destination(recipient)
  end
  bulk_templates
end

def send_bulk_email_chunk(chunk)
  resp = $client.send_bulk_templated_email(chunk)
  status = resp.status[0].status
  error = resp.status[0].error
  if (error != nil)
    raise "Error unrelated to account throttle" if status != "AccountThrottled"
    return false
  else
    puts "Successfully sent #{chunk[:destinations].length} emails"
    return true
  end
end

def send_bulk_emails()
  create_template
  bulk_templates = construct_bulk_templates
  bulk_templates.each_with_index do |bulk_template|
    success = false
    until success
      success = send_bulk_email_chunk(bulk_template)
      sleep(1.1) unless success
    end
    sleep(1.1)
  end
  puts "Deleting template named '#{$config[:template_name]}'"
  delete_email_template($config[:template_name])
end

send_bulk_emails()
