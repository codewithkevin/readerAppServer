
#!/bin/bash
set -e

#add admin user for readerApp dashboard
mongosh --file ./scripts/files/addAdminUser.js