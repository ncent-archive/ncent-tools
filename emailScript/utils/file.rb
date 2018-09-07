def csv_to_array
  arr = []
  CSV.foreach($config[:csv_file], headers: true) do |row|
    hsh = row.to_hash
    new_hsh = {}
    new_hsh[:first_name] = hsh['first_name']
    new_hsh[:last_name] = hsh['last_name']
    new_hsh[:email] = hsh['email']
    arr.push(new_hsh)
  end
  arr
end

def get_str_from_file(filepath)
  str = ""
  File.foreach(filepath) do |line|
    str += line
  end
  str
end
