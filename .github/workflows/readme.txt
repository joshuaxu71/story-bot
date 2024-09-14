After generating the ssh keys, I encountered problems when trying to ssh into the EC2.
This was resolved after running the following commands.

# Navigate to the user's home directory
cd /home/ec2-user

# Fix permissions for .ssh directory
chmod 700 .ssh

# Fix permissions for authorized_keys file
chmod 600 .ssh/authorized_keys

# Fix ownership
chown ec2-user:ec2-user .ssh
chown ec2-user:ec2-user .ssh/authorized_keys

# Restart SSH service
sudo systemctl restart sshd

Also, I decided to make the .env file in the EC2 instance instead.
I tried using parameter store, using repository secrets, but couldn't manage to make it work.