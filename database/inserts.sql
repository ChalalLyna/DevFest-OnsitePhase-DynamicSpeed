INSERT INTO Client (ipAddress, status, name)
VALUES ('192.168.1.1', 'active', 'Client A');

INSERT INTO Client (ipAddress, status, name)
VALUES ('192.168.1.2', 'inactive', 'Client B');


INSERT INTO Bandwidth (timestamp, bandwidthLimit, bandwidthRequested, connectionSpeed, clientId)
VALUES (NOW(), 5, 5.5, 5.8, 1);

INSERT INTO Bandwidth (timestamp, bandwidthLimit, bandwidthRequested, connectionSpeed, clientId)
VALUES (NOW(), 4, 5.5, 4, 2);

INSERT INTO Admin (username, password, email)
VALUES ('admin1', '$2a$10$KxCw9fKQb2zMrZTiTkaFtuA0kTiDAtp0RE4asnR0xqWbicgMfwyrq', 'admin1@gmail.com');
