const grpc = require('grpc');

const protoPath = require('path').join(__dirname, '.', '/');

const proto = grpc.load ({
  root: protoPath,
  file: './proto/leave.proto'
});

const client = new proto.policy.EmployeeLeaveDaysService('172.16.66.145:50050', grpc.credentials.createInsecure());

const employees = {
  valid: {
    employee_id: 1,
    name: 'Shalimar the clown',
    accrued_leave_days: 10,
    requested_leave_days: 4
  }
}

client.eligibleForLeave(employees.valid, (error, response) => {
  if(!error) {
    if(response.eligible) {
      client.grantLeave(employees.valid, (error, response) => {
        console.log(response);
      });
    } else {
      console.log("You are currently not eligible for leave days", response);
    }
  } else {
    console.log("Error: ", error.message);
  }
});
