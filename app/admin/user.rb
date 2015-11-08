ActiveAdmin.register User do
  permit_params :email, :password

  index do
    selectable_column
    id_column
    column :username
    column :email
    actions
  end

  form do |f|
    f.inputs "User Details" do
      f.input :username
      f.input :email
      f.input :password
    end
    f.actions
  end

end
