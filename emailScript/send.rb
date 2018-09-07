require 'aws-sdk-ses'
require 'csv'
require 'json'
require_relative 'config'

$client = Aws::SES::Client.new(region: 'us-west-2')

def createTemplate()
  html_str = get_str_from_file($config[:html_file])
  plain_str = get_str_from_file($config[:plain_file])
  $client.create_template({
    template: {
      template_name: $config[:template_name],
      subject_part: $config[:email_subject],
      text_part: plain_str,
      html_part: html_str,
      },
    })
end

def construct_bulk_email()
  bulk_template = {
    source: $config[:from],
    template: $config[:template_name],
    destinations: [],
    default_template_data: { first_name: 'DEFAULT_FIRST_NAME', last_name: 'DEFAULT_LAST_NAME'}.to_json
    # TODO decide on default name
  }

  # TODO MAX 50 email destinations in each call to SendBulkTemplatedEmail
  CSV.foreach($config[:csv_file], headers: true) do |row|
    hsh = row.to_hash
    destination = {
      destination: {
        to_addresses: [ hsh['email'] ]
      },
      replacement_template_data: { first_name: hsh['first_name'], last_name: hsh['last_name']}.to_json
    }
    bulk_template[:destinations].push(destination)
  end

  bulk_template
end

def send_bulk_email()
  createTemplate()
  bulk_template = construct_bulk_email()
  resp = $client.send_bulk_templated_email(bulk_template)
  puts resp
end

def get_str_from_file(filepath)
  str = ""
  File.foreach(filepath) do |line|
    str += line
  end
  str
end

send_bulk_email()
