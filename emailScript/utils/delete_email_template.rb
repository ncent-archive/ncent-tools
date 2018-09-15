require 'aws-sdk-ses'

def delete_email_template(template_name)
  resp = $client.delete_template({
    template_name: template_name
  })
end
