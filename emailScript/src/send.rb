require 'aws-sdk-ses'
require 'csv'
require 'json'
require_relative 'config'
require_relative '../utils/utils'

$client = Aws::SES::Client.new(region: 'us-west-2')

def construct_bulk_email()
  recipient_data = csv_to_array
  bulk_template = {
    source: $config[:from],
    template: $config[:template_name],
    destinations: [],
    default_template_data: {
      first_name: $config[:default_first_name],
      last_name: $config[:default_last_name]
    }.to_json
  }
  recipient_data.each do |recipient|
    # TODO put limit on recipient iterations based on throttling
    destination = {
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
    bulk_template[:destinations].push(destination)
  end

  bulk_template
end

def send_bulk_email()
  create_template
  bulk_template = construct_bulk_email
  resp = $client.send_bulk_templated_email(bulk_template)
  status = resp.status[0].status
  error = resp.status[0].error
  if (error != nil)
    if (status == "AccountThrottled")

    else
      raise "Unexpected error that is not related to account throttling"
    end
  else
    puts "Successfully sent emails"
    puts "Deleting template...#{$config[:template_name]}"
    delete_email_template($config[:template_name])
  end
end

send_bulk_email()
