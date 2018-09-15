def create_template()
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
