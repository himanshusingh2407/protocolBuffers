const grpc = require('grpc');
const proto = grpc.load('../proto/leave.proto');
const server = new grpc.Server();

server.addProtoService(proto.policy.EmployeeLeaveDaysService.service, {

  eligibleForLeave(call, callback) {
    if (call.request.requested_leave_days > 0) {
      console.log(call.request);
      if(call.request.accrued_leave_days > call.request.requested_leave_days) {
        callback(null, {eligible: true});
      } else {
        callback(null, {eligible: false});
      }
    } else {
      callback(new Error('Invalid requested days'));
    }
  },

  grantLeave(call, callback) {
    let granted_leave_days = call.request.requested_leave_days;
    let accrued_leave_days = call.request.accrued_leave_days - granted_leave_days;

    callback(null, {
      granted: true,
      granted_leave_days,
      accrued_leave_days
    });
  }
});

server.bind('0.0.0.0:50050', grpc.ServerCredentials.createInsecure());
server.start();
console.log('grpc running on port:', '0.0.0.0:50050');
