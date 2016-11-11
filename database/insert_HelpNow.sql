SET foreign_key_checks=0;
TRUNCATE helpnow.Account;
TRUNCATE helpnow.AccountRole;
TRUNCATE helpnow.Address;
TRUNCATE helpnow.Event;
TRUNCATE helpnow.EventLocation;
TRUNCATE helpnow.EventType;
TRUNCATE helpnow.Organization;
TRUNCATE helpnow.OrganizationRegulations;
TRUNCATE helpnow.OrganizationType;
TRUNCATE helpnow.RequestState;
TRUNCATE helpnow.RequestUrgency;
TRUNCATE helpnow.ResourceLocation;
TRUNCATE helpnow.ResourceLocationType;
TRUNCATE helpnow.ResourceLocationTransport;
TRUNCATE helpnow.TransportType;
TRUNCATE helpnow.ResourceRequest;
TRUNCATE helpnow.ResourceResponse;
TRUNCATE helpnow.ResourceType;
TRUNCATE helpnow.ResourceSubtype;
TRUNCATE helpnow.ResponseState;
TRUNCATE helpnow.ResourceLocationInventory;
TRUNCATE helpnow.ResourceTypeUnitOfMeasure;
TRUNCATE helpnow.InviteRequest;
TRUNCATE helpnow.ResourceLocationStatus;
TRUNCATE helpnow.Blockage;
TRUNCATE helpnow.BlockageSource;
TRUNCATE helpnow.MapLayer;
TRUNCATE helpnow.MapLayerType;


DROP TRIGGER IF EXISTS `helpnow`.`InviteRequest_GUID`;
DROP TRIGGER IF EXISTS `helpnow`.`Organization_APIKey`;

delimiter $$
CREATE TRIGGER 
	`helpnow`.`InviteRequest_GUID` 
BEFORE INSERT ON 
	`InviteRequest` 
FOR EACH ROW
	BEGIN
		SET new.InviteID = uuid();
	END;

$$
delimiter ;


INSERT INTO `helpnow`.`AccountRole` (`AccountRoleID`, `Name`) VALUES ('1', 'SuperAdmin');
INSERT INTO `helpnow`.`AccountRole` (`AccountRoleID`, `Name`) VALUES ('2', 'Admin');

INSERT INTO `helpnow`.`Account` (`Username`, `LastName`, `FirstName`, `Email`, `Password`, `AccountRoleID`, `CreateDate`, `OrganizationID`, `Active`) VALUES ('tuser', 'User', 'Test', 'test.user@testemail.com', 'demopassword', 1, CURDATE(),1, 1);


INSERT INTO `helpnow`.`Address` (`StreetNumber`, `StreetName`, `StreetType`, `MajorMunicipality`, `GoverningDistrict`, `PostalArea`, `Country`) VALUES ('12999', 'Deer Creek Canyon', 'Road', 'Littleton', 'CO', '80217', 'United States of America');
INSERT INTO `helpnow`.`Address` (`StreetName`, `StreetType`, `MajorMunicipality`, `MinorMunicipality`, `PostalArea`, `Country`) VALUES ('Bir Uttam Zaiur Rahman', 'Road', 'Dhaka', 'Elenbari', '1215', 'Bangladesh');

INSERT INTO `helpnow`.`OrganizationType` (`OrganizationTypeID`, `Description`) VALUES ('1', 'Government');
INSERT INTO `helpnow`.`OrganizationType` (`OrganizationTypeID`, `Description`) VALUES ('2', 'NGO');
INSERT INTO `helpnow`.`OrganizationType` (`OrganizationTypeID`, `Description`) VALUES ('3', 'App');

INSERT INTO `helpnow`.`Organization` (`Name`, `OrganizationTypeID`, `APIKey`, `APISecret`, `Active`) VALUES ('HelpNow', '3', '12345678-1234-1234-1234-123456789012', 'apitestsecret', 1);
                                                                                                                              
#now we create the APIKey Trigger
delimiter $$
CREATE TRIGGER 
	`helpnow`.`Organization_APIKey` 
BEFORE INSERT ON 
	`Organization` 
FOR EACH ROW
	BEGIN
		SET new.APIKey = uuid();
	END;
$$
delimiter ;

INSERT INTO `helpnow`.`Organization` (`Name`, `OrganizationTypeID`, `AddressID`, `PrimaryPOC`, `SecondaryPOC`, `Active`) VALUES ('City of Dhaka', '1', '2', '1', '2', 1);
INSERT INTO `helpnow`.`Organization` (`Name`, `OrganizationTypeID`, `AddressID`, `PrimaryPOC`, `SecondaryPOC`, `Active`) VALUES ('USAID', '2', '1', '3', '6', 1);
INSERT INTO `helpnow`.`Organization` (`Name`, `OrganizationTypeID`, `AddressID`, `PrimaryPOC`, `SecondaryPOC`, `Active`) VALUES ('EuropeAid', '2', '1', '4', '3', 1);
INSERT INTO `helpnow`.`Organization` (`Name`, `OrganizationTypeID`, `AddressID`, `PrimaryPOC`, `SecondaryPOC`, `Active`) VALUES ('City of Papua', '1', '1', '5', '4', 1);
INSERT INTO `helpnow`.`Organization` (`Name`, `OrganizationTypeID`, `AddressID`, `PrimaryPOC`, `SecondaryPOC`, `Active`) VALUES ('AusAid', '2', '1', '6', '9', 1);
INSERT INTO `helpnow`.`Organization` (`Name`, `OrganizationTypeID`, `AddressID`, `PrimaryPOC`, `SecondaryPOC`, `Active`) VALUES ('DFID', '2', '1', '7', '8', 1);
INSERT INTO `helpnow`.`Organization` (`Name`, `OrganizationTypeID`, `AddressID`, `PrimaryPOC`, `SecondaryPOC`, `Active`) VALUES ('UNICEF', '2', '1', '8', '7', 1);
INSERT INTO `helpnow`.`Organization` (`Name`, `OrganizationTypeID`, `AddressID`, `PrimaryPOC`, `SecondaryPOC`, `Active`) VALUES ('Government of Bangladesh', '2', '2', '9', '6', 1);

INSERT INTO `helpnow`.`EventType` (`EventTypeID`, `Description`) VALUES ('1', 'Flood');
INSERT INTO `helpnow`.`EventType` (`EventTypeID`, `Description`) VALUES ('2', 'Tsunami');
INSERT INTO `helpnow`.`EventType` (`EventTypeID`, `Description`) VALUES ('3', 'Earthquake');
INSERT INTO `helpnow`.`EventType` (`EventTypeID`, `Description`) VALUES ('4', 'Hurricane');
INSERT INTO `helpnow`.`EventType` (`EventTypeID`, `Description`) VALUES ('5', 'Typhoon');

INSERT INTO `helpnow`.`Event` (`EventID`, `EventTypeID`, `OrganizationID`, `Summary`, `Active`, `CreateDate`, `Keywords`) VALUES ('1', '1', '1', 'Dhaka, Bangladesh', '1', CURDATE(), '#HelpNow, #DhakaFlood');
INSERT INTO `helpnow`.`Event` (`EventID`, `EventTypeID`, `OrganizationID`, `Summary`, `Active`, `CreateDate`, `Keywords`) VALUES ('2', '2', '4', 'Port Moresby, Papua New Guinea', '1', CURDATE(), '#HelpNow, #PortMoresbyCrisis');
INSERT INTO `helpnow`.`Event` (`EventID`, `EventTypeID`, `OrganizationID`, `Summary`, `Active`, `CreateDate`, `Keywords`) VALUES ('3', '3', '4', 'Tacna, Peru', '1', CURDATE(), '#HelpNow, #PeruCrisis');

INSERT INTO `helpnow`.`EventLocation` (`EventLocationID`, `EventID`, `Description`, `LAT`, `LONG`, `Radius`) VALUES ('1', '1', 'Dhaka, Bangladesh', '23.713', '90.39', '542');
INSERT INTO `helpnow`.`EventLocation` (`EventLocationID`, `EventID`, `Description`, `LAT`, `LONG`, `Radius`) VALUES ('2', '2', 'Port Moresby, Papua New Guinea', '-9.46', '147.18', '1024');
INSERT INTO `helpnow`.`EventLocation` (`EventLocationID`, `EventID`, `Description`, `LAT`, `LONG`, `Radius`) VALUES ('3', '3', 'Tacna, Peru', '-18.04', '-70.174', '860');

INSERT INTO `helpnow`.`OrganizationRegulations` (`OrganizationID`, `Summary`, `Narrative`) VALUES ('1', 'Policy A.1.2.3', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ac finibus neque, eu porttitor elit. Vivamus convallis euismod turpis, eu ultrices mauris fermentum vitae. In dictum elit nec enim pretium, nec efficitur erat porttitor. Nam fermentum libero nec facilisis ornare. Curabitur vestibulum nisl sit amet ornare elementum. Vivamus facilisis metus ut feugiat suscipit. Nunc iaculis ligula eu enim ultricies laoreet. ');
INSERT INTO `helpnow`.`OrganizationRegulations` (`OrganizationID`, `Summary`, `Narrative`) VALUES ('1', 'Policy B.1.2.4', 'Donec rutrum congue leo eget malesuada. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla porttitor accumsan tincidunt. Curabitur aliquet quam id dui posuere blandit. Donec sollicitudin molestie malesuada. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec rutrum congue leo eget malesuada. Donec rutrum congue leo eget malesuada. Vivamus magna justo, lacinia eget consectetur sed, convallis at tellus. Praesent sapien massa, convallis a pellentesque nec, egestas non nisi.');
INSERT INTO `helpnow`.`OrganizationRegulations` (`OrganizationID`, `Summary`, `Narrative`) VALUES ('1', 'Regulation R.A-2', 'Nulla porttitor accumsan tincidunt. Donec rutrum congue leo eget malesuada. Donec rutrum congue leo eget malesuada. Cras ultricies ligula sed magna dictum porta. Curabitur non nulla sit amet nisl tempus convallis quis ac lectus. Nulla quis lorem ut libero malesuada feugiat. Vivamus suscipit tortor eget felis porttitor volutpat. Proin eget tortor risus. Donec sollicitudin molestie malesuada. Pellentesque in ipsum id orci porta dapibus.');
INSERT INTO `helpnow`.`OrganizationRegulations` (`OrganizationID`, `Summary`, `Narrative`) VALUES ('2', 'Policy Regulation S.AT-2', 'Porttitor accumsan tincidunt. Donec rutrum congue leo eget malesuada. Donec rutrum congue leo eget malesuada. Cras ultricies ligula sed magna dictum porta. Curabitur non nulla sit amet nisl tempus convallis quis ac lectus. Nulla quis lorem ut libero malesuada feugiat. Vivamus suscipit tortor eget felis porttitor volutpat. Proin eget tortor risus. Donec sollicitudin molestie malesuada. Pellentesque in ipsum id orci porta dapibus.');

INSERT INTO `helpnow`.`ResourceType` (`ResourceTypeID`, `Description`) VALUES (1, 'Water');
INSERT INTO `helpnow`.`ResourceType` (`ResourceTypeID`, `Description`) VALUES (2, 'Food');
INSERT INTO `helpnow`.`ResourceType` (`ResourceTypeID`, `Description`) VALUES (3, 'Shelter');
INSERT INTO `helpnow`.`ResourceType` (`ResourceTypeID`, `Description`) VALUES (4, 'First Aid');
INSERT INTO `helpnow`.`ResourceType` (`ResourceTypeID`, `Description`) VALUES (5, 'Clothing');
INSERT INTO `helpnow`.`ResourceType` (`ResourceTypeID`, `Description`) VALUES (6, 'Medicine');
INSERT INTO `helpnow`.`ResourceType` (`ResourceTypeID`, `Description`) VALUES (7, 'Evacuation');
INSERT INTO `helpnow`.`ResourceType` (`ResourceTypeID`, `Description`) VALUES (8, 'Rescue');

INSERT INTO `helpnow`.`ResourceSubtype` (`ResourceSubtypeID`, `ResourceTypeID`, `Description`) VALUES (1, 1, 'Potable');
INSERT INTO `helpnow`.`ResourceSubtype` (`ResourceSubtypeID`, `ResourceTypeID`, `Description`) VALUES (2, 1, 'Non-potable');

INSERT INTO `helpnow`.`RequestState` (`RequestStateID`, `Description`) VALUES ('1', 'Active');
INSERT INTO `helpnow`.`RequestState` (`RequestStateID`, `Description`) VALUES ('2', 'Resolved');

INSERT INTO `helpnow`.`RequestUrgency` (`Level`, `Description`) VALUES ('1', 'Low');
INSERT INTO `helpnow`.`RequestUrgency` (`Level`, `Description`) VALUES ('2', 'Medium');
INSERT INTO `helpnow`.`RequestUrgency` (`Level`, `Description`) VALUES ('3', 'High');
INSERT INTO `helpnow`.`RequestUrgency` (`Level`, `Description`) VALUES ('4', 'Critical');
INSERT INTO `helpnow`.`RequestUrgency` (`Level`, `Description`) VALUES ('5', 'Immediate Danger');

/*
INSERT INTO `helpnow`.`ResourceRequest` (`ResourceRequestID`, `EventID`, `RequestStateID`, `Notes`, `Quantity`, `ResourceTypeID`, `LAT`, `LONG`, `RequestUrgencyID`) VALUES ('1', '1', '1', 'Need food urgently', '5', '1', '23.718', '90.355', '2');
INSERT INTO `helpnow`.`ResourceRequest` (`ResourceRequestID`, `EventID`, `RequestStateID`, `Notes`, `Quantity`, `ResourceTypeID`, `LAT`, `LONG`, `RequestUrgencyID`) VALUES ('2', '1', '1', 'Please help', '4', '2', '23.719', '90.374', '3');
INSERT INTO `helpnow`.`ResourceRequest` (`ResourceRequestID`, `EventID`, `RequestStateID`, `Notes`, `Quantity`, `ResourceTypeID`, `LAT`, `LONG`, `RequestUrgencyID`) VALUES ('3', '1', '1', 'Please help', '3', '3', '23.765', '90.398', '4');
INSERT INTO `helpnow`.`ResourceRequest` (`ResourceRequestID`, `EventID`, `RequestStateID`, `Notes`, `Quantity`, `ResourceTypeID`, `LAT`, `LONG`, `RequestUrgencyID`) VALUES ('4', '1', '1', 'Please help', '5', '4', '23.767', '90.41', '1');
INSERT INTO `helpnow`.`ResourceRequest` (`ResourceRequestID`, `EventID`, `RequestStateID`, `Notes`, `Quantity`, `ResourceTypeID`, `LAT`, `LONG`, `RequestUrgencyID`) VALUES ('5', '1', '1', 'Please help', '4', '5', '23.73', '90.365', '4');
INSERT INTO `helpnow`.`ResourceRequest` (`ResourceRequestID`, `EventID`, `RequestStateID`, `Notes`, `Quantity`, `ResourceTypeID`, `LAT`, `LONG`, `RequestUrgencyID`) VALUES ('6', '1', '1', 'Please help', '4', '6', '23.72', '90.38', '1');
INSERT INTO `helpnow`.`ResourceRequest` (`ResourceRequestID`, `EventID`, `RequestStateID`, `Notes`, `Quantity`, `ResourceTypeID`, `LAT`, `LONG`, `RequestUrgencyID`) VALUES ('7', '1', '1', 'Need food urgently', '5', '1', '23.723', '90.352', '2');
INSERT INTO `helpnow`.`ResourceRequest` (`ResourceRequestID`, `EventID`, `RequestStateID`, `Notes`, `Quantity`, `ResourceTypeID`, `LAT`, `LONG`, `RequestUrgencyID`) VALUES ('8', '1', '1', 'Please help', '4', '2', '23.719', '90.374', '3');
INSERT INTO `helpnow`.`ResourceRequest` (`ResourceRequestID`, `EventID`, `RequestStateID`, `Notes`, `Quantity`, `ResourceTypeID`, `LAT`, `LONG`, `RequestUrgencyID`) VALUES ('9', '1', '1', 'Please help', '3', '3', '23.74', '90.378', '5');
INSERT INTO `helpnow`.`ResourceRequest` (`ResourceRequestID`, `EventID`, `RequestStateID`, `Notes`, `Quantity`, `ResourceTypeID`, `LAT`, `LONG`, `RequestUrgencyID`) VALUES ('10', '1', '1', 'Please help', '5', '4', '23.775', '90.38', '1');
*/

INSERT INTO `helpnow`.`ResourceLocationType` (`Description`) VALUES ('Distribution Center');
INSERT INTO `helpnow`.`ResourceLocationType` (`Description`) VALUES ('Deployment');

INSERT INTO `helpnow`.`ResourceLocationStatus` (`ResourceLocationStatusID`, `Status`) VALUES ('1', 'Planned');
INSERT INTO `helpnow`.`ResourceLocationStatus` (`ResourceLocationStatusID`, `Status`) VALUES ('2', 'Active');

INSERT INTO `helpnow`.`ResourceLocation` (`OrganizationID`, `ResourceLocationTypeID`, `EventID`, `Description`, `Notes`, `LAT`, `LONG`, `PrimaryPOCName`, `PrimaryPOCPhone`, `SecondaryPOCName`, `SecondaryPOCPhone`, `ResourceLocationStatusID`) VALUES ('1','1','1','Distribution Center A','Note 1', '23.72', '90.40','Jon Smith', '1-458-555-4685', 'Alex Kirk', '1-444-555-8675', '1');
INSERT INTO `helpnow`.`ResourceLocation` (`OrganizationID`, `ResourceLocationTypeID`, `EventID`, `Description`, `Notes`, `LAT`, `LONG`, `PrimaryPOCName`, `PrimaryPOCPhone`, `SecondaryPOCName`, `SecondaryPOCPhone`, `ResourceLocationStatusID`) VALUES ('1','2','1','Deployment A','Note 2', '23.70', '90.40', 'Madison Schwartz', '1-497-555-4685', 'Alex McDonald', '1-444-555-9875', '2');
INSERT INTO `helpnow`.`ResourceLocation` (`OrganizationID`, `ResourceLocationTypeID`, `EventID`, `Description`, `Notes`, `LAT`, `LONG`, `PrimaryPOCName`, `PrimaryPOCPhone`, `SecondaryPOCName`, `SecondaryPOCPhone`, `ResourceLocationStatusID`) VALUES ('2','1','1','Distribution Center B','Note 3', '23.75', '90.46', 'Emannuel Lacky', '1-561-555-4685', 'Adrienne Rocky', '1-444-555-5309', '1');
INSERT INTO `helpnow`.`ResourceLocation` (`OrganizationID`, `ResourceLocationTypeID`, `EventID`, `Description`, `Notes`, `LAT`, `LONG`, `PrimaryPOCName`, `PrimaryPOCPhone`, `SecondaryPOCName`, `SecondaryPOCPhone`, `ResourceLocationStatusID`) VALUES ('3','1','1','Distribution Center C','Note 4', '23.69', '90.41', 'Nolan Helton', '1-789-555-2342', 'Matt Collins', '1-303-555-5309', '1');
INSERT INTO `helpnow`.`ResourceLocation` (`OrganizationID`, `ResourceLocationTypeID`, `EventID`, `Description`, `Notes`, `LAT`, `LONG`, `PrimaryPOCName`, `PrimaryPOCPhone`, `SecondaryPOCName`, `SecondaryPOCPhone`, `ResourceLocationStatusID`) VALUES ('4','1','1','Distribution Center D','Note 5', '23.718', '90.355', 'April Sanders', '1-852-555-6278', 'Roger Helsmith', '1-210-555-3598', '1');
INSERT INTO `helpnow`.`ResourceLocation` (`OrganizationID`, `ResourceLocationTypeID`, `EventID`, `Description`, `Notes`, `LAT`, `LONG`, `PrimaryPOCName`, `PrimaryPOCPhone`, `SecondaryPOCName`, `SecondaryPOCPhone`, `ResourceLocationStatusID`) VALUES ('1','2','1','Deployment First Aid','Note 6', '23.72', '90.360', 'Joe Thomas', '1-458-555-4685', 'Tim Cambpell', '1-510-555-9875', '1');
INSERT INTO `helpnow`.`ResourceLocation` (`OrganizationID`, `ResourceLocationTypeID`, `EventID`, `Description`, `Notes`, `LAT`, `LONG`, `PrimaryPOCName`, `PrimaryPOCPhone`, `SecondaryPOCName`, `SecondaryPOCPhone`, `ResourceLocationStatusID`) VALUES ('2','2','1','Deployment Water',NULL, '23.72', '90.360', 'Samantha Johnson', '1-685-555-4485', 'Coby Hatton', '1-720-555-4488', '1');
INSERT INTO `helpnow`.`ResourceLocation` (`OrganizationID`, `ResourceLocationTypeID`, `EventID`, `Description`, `Notes`, `LAT`, `LONG`, `PrimaryPOCName`, `PrimaryPOCPhone`, `SecondaryPOCName`, `SecondaryPOCPhone`, `ResourceLocationStatusID`) VALUES ('4','1','1','First Aid Distribution Center ','Note 7', '23.719', '90.374', 'Miguel Ramirez', '1-458-555-4685', 'Sally Thompson', '1-444-555-9875', '1');
INSERT INTO `helpnow`.`ResourceLocation` (`OrganizationID`, `ResourceLocationTypeID`, `EventID`, `Description`, `Notes`, `LAT`, `LONG`, `PrimaryPOCName`, `PrimaryPOCPhone`, `SecondaryPOCName`, `SecondaryPOCPhone`, `ResourceLocationStatusID`) VALUES ('3','1','1','Distribution Center E','Note 8', '23.765', '90.398', 'Matt Doer Reed', '1-458-555-4685', 'Adrienne Helms Major', '1-444-555-9875', '1');
INSERT INTO `helpnow`.`ResourceLocation` (`OrganizationID`, `ResourceLocationTypeID`, `EventID`, `Description`, `Notes`, `LAT`, `LONG`, `PrimaryPOCName`, `PrimaryPOCPhone`, `SecondaryPOCName`, `SecondaryPOCPhone`, `ResourceLocationStatusID`) VALUES ('3','1','1','Distribution Center F',NULL, '23.767', '90.41', 'Brad Smith', '1-458-555-4685', 'Michael Lau', '1-444-555-9875', '1');
INSERT INTO `helpnow`.`ResourceLocation` (`OrganizationID`, `ResourceLocationTypeID`, `EventID`, `Description`, `Notes`, `LAT`, `LONG`, `PrimaryPOCName`, `PrimaryPOCPhone`, `SecondaryPOCName`, `SecondaryPOCPhone`, `ResourceLocationStatusID`) VALUES ('2','2',NULL,'Deployment Food',NULL, '23.78', '90.43', 'Stephanie Coleman', '1-458-555-4685', 'Debbie Serot', '1-444-555-9875', '1');
INSERT INTO `helpnow`.`ResourceLocation` (`OrganizationID`, `ResourceLocationTypeID`, `EventID`, `Description`, `Notes`, `LAT`, `LONG`, `PrimaryPOCName`, `PrimaryPOCPhone`, `SecondaryPOCName`, `SecondaryPOCPhone`, `ResourceLocationStatusID`) VALUES ('4','1',NULL,'Distribution Center G','Note 9', '23.73', '90.365', 'Randy McClellan', '1-458-555-4685', 'Mary Harris', '1-444-555-9875', '1');

INSERT INTO `helpnow`.`ResourceTypeUnitOfMeasure` (`ResourceTypeID`, `Description`) VALUES ('2', 'Liters');
INSERT INTO `helpnow`.`ResourceTypeUnitOfMeasure` (`ResourceTypeID`, `Description`) VALUES ('2', 'Bottles');
INSERT INTO `helpnow`.`ResourceTypeUnitOfMeasure` (`ResourceTypeID`, `Description`) VALUES ('2', 'Ounces');
INSERT INTO `helpnow`.`ResourceTypeUnitOfMeasure` (`ResourceTypeID`, `Description`) VALUES ('2', 'Gallons');
INSERT INTO `helpnow`.`ResourceTypeUnitOfMeasure` (`ResourceTypeID`, `Description`) VALUES ('1', 'MREs');
INSERT INTO `helpnow`.`ResourceTypeUnitOfMeasure` (`ResourceTypeID`, `Description`) VALUES ('1', 'Bushel');
INSERT INTO `helpnow`.`ResourceTypeUnitOfMeasure` (`ResourceTypeID`, `Description`) VALUES ('1', 'Meal');
INSERT INTO `helpnow`.`ResourceTypeUnitOfMeasure` (`ResourceTypeID`, `Description`) VALUES ('1', 'Bag');
INSERT INTO `helpnow`.`ResourceTypeUnitOfMeasure` (`ResourceTypeID`, `Description`) VALUES ('3', 'Uncovered');
INSERT INTO `helpnow`.`ResourceTypeUnitOfMeasure` (`ResourceTypeID`, `Description`) VALUES ('3', 'Covered');
INSERT INTO `helpnow`.`ResourceTypeUnitOfMeasure` (`ResourceTypeID`, `Description`) VALUES ('3', 'No Heat');
INSERT INTO `helpnow`.`ResourceTypeUnitOfMeasure` (`ResourceTypeID`, `Description`) VALUES ('4', 'Station');
INSERT INTO `helpnow`.`ResourceTypeUnitOfMeasure` (`ResourceTypeID`, `Description`) VALUES ('4', 'ER');
INSERT INTO `helpnow`.`ResourceTypeUnitOfMeasure` (`ResourceTypeID`, `Description`) VALUES ('5', 'Coats');
INSERT INTO `helpnow`.`ResourceTypeUnitOfMeasure` (`ResourceTypeID`, `Description`) VALUES ('5', 'Shoes');
INSERT INTO `helpnow`.`ResourceTypeUnitOfMeasure` (`ResourceTypeID`, `Description`) VALUES ('5', 'General');
INSERT INTO `helpnow`.`ResourceTypeUnitOfMeasure` (`ResourceTypeID`, `Description`) VALUES ('6', 'OTC');
INSERT INTO `helpnow`.`ResourceTypeUnitOfMeasure` (`ResourceTypeID`, `Description`) VALUES ('6', 'Pain Mgmt');
INSERT INTO `helpnow`.`ResourceTypeUnitOfMeasure` (`ResourceTypeID`, `Description`) VALUES ('6', 'Viral');
INSERT INTO `helpnow`.`ResourceTypeUnitOfMeasure` (`ResourceTypeID`, `Description`) VALUES ('8', 'Team');

INSERT INTO `helpnow`.`ResourceLocationInventory` (`ResourceLocationID`, `ResourceTypeID`, `Quantity`, `ResourceTypeUnitOfMeasureID`) VALUES ('1', '1', '1000', '4');
INSERT INTO `helpnow`.`ResourceLocationInventory` (`ResourceLocationID`, `ResourceTypeID`, `Quantity`, `ResourceTypeUnitOfMeasureID`) VALUES ('1', '2', '1000', '5');
INSERT INTO `helpnow`.`ResourceLocationInventory` (`ResourceLocationID`, `ResourceTypeID`, `Quantity`, `ResourceTypeUnitOfMeasureID`) VALUES ('1', '3', '2', '10');
INSERT INTO `helpnow`.`ResourceLocationInventory` (`ResourceLocationID`, `ResourceTypeID`, `Quantity`, `ResourceTypeUnitOfMeasureID`) VALUES ('2', '1', '10000', '2');
INSERT INTO `helpnow`.`ResourceLocationInventory` (`ResourceLocationID`, `ResourceTypeID`, `Quantity`, `ResourceTypeUnitOfMeasureID`) VALUES ('2', '4', '3', '12');
INSERT INTO `helpnow`.`ResourceLocationInventory` (`ResourceLocationID`, `ResourceTypeID`, `Quantity`, `ResourceTypeUnitOfMeasureID`) VALUES ('2', '4', '1', '13');
INSERT INTO `helpnow`.`ResourceLocationInventory` (`ResourceLocationID`, `ResourceTypeID`, `Quantity`, `ResourceTypeUnitOfMeasureID`) VALUES ('7', '1', '10000', '4');
INSERT INTO `helpnow`.`ResourceLocationInventory` (`ResourceLocationID`, `ResourceTypeID`, `Quantity`, `ResourceTypeUnitOfMeasureID`) VALUES ('8', '5', '100', '14');

INSERT INTO `helpnow`.`ResourceLocationInventory` (`ResourceLocationID`, `ResourceTypeID`, `Quantity`, `ResourceTypeUnitOfMeasureID`) VALUES ('3', '1', '1000', '4');
INSERT INTO `helpnow`.`ResourceLocationInventory` (`ResourceLocationID`, `ResourceTypeID`, `Quantity`, `ResourceTypeUnitOfMeasureID`) VALUES ('3', '2', '1000', '5');
INSERT INTO `helpnow`.`ResourceLocationInventory` (`ResourceLocationID`, `ResourceTypeID`, `Quantity`, `ResourceTypeUnitOfMeasureID`) VALUES ('3', '3', '2', '10');
INSERT INTO `helpnow`.`ResourceLocationInventory` (`ResourceLocationID`, `ResourceTypeID`, `Quantity`, `ResourceTypeUnitOfMeasureID`) VALUES ('4', '1', '10000', '2');
INSERT INTO `helpnow`.`ResourceLocationInventory` (`ResourceLocationID`, `ResourceTypeID`, `Quantity`, `ResourceTypeUnitOfMeasureID`) VALUES ('4', '4', '3', '12');
INSERT INTO `helpnow`.`ResourceLocationInventory` (`ResourceLocationID`, `ResourceTypeID`, `Quantity`, `ResourceTypeUnitOfMeasureID`) VALUES ('4', '4', '1', '13');
INSERT INTO `helpnow`.`ResourceLocationInventory` (`ResourceLocationID`, `ResourceTypeID`, `Quantity`, `ResourceTypeUnitOfMeasureID`) VALUES ('5', '1', '10000', '4');
INSERT INTO `helpnow`.`ResourceLocationInventory` (`ResourceLocationID`, `ResourceTypeID`, `Quantity`, `ResourceTypeUnitOfMeasureID`) VALUES ('5', '5', '1', '14');
INSERT INTO `helpnow`.`ResourceLocationInventory` (`ResourceLocationID`, `ResourceTypeID`, `Quantity`, `ResourceTypeUnitOfMeasureID`) VALUES ('5', '1', '1000', '4');
INSERT INTO `helpnow`.`ResourceLocationInventory` (`ResourceLocationID`, `ResourceTypeID`, `Quantity`, `ResourceTypeUnitOfMeasureID`) VALUES ('9', '2', '1000', '5');
INSERT INTO `helpnow`.`ResourceLocationInventory` (`ResourceLocationID`, `ResourceTypeID`, `Quantity`, `ResourceTypeUnitOfMeasureID`) VALUES ('9', '3', '2', '10');
INSERT INTO `helpnow`.`ResourceLocationInventory` (`ResourceLocationID`, `ResourceTypeID`, `Quantity`, `ResourceTypeUnitOfMeasureID`) VALUES ('9', '1', '10000', '2');
INSERT INTO `helpnow`.`ResourceLocationInventory` (`ResourceLocationID`, `ResourceTypeID`, `Quantity`, `ResourceTypeUnitOfMeasureID`) VALUES ('10', '4', '3', '12');
INSERT INTO `helpnow`.`ResourceLocationInventory` (`ResourceLocationID`, `ResourceTypeID`, `Quantity`, `ResourceTypeUnitOfMeasureID`) VALUES ('10', '4', '1', '13');
INSERT INTO `helpnow`.`ResourceLocationInventory` (`ResourceLocationID`, `ResourceTypeID`, `Quantity`, `ResourceTypeUnitOfMeasureID`) VALUES ('10', '1', '10000', '4');
INSERT INTO `helpnow`.`ResourceLocationInventory` (`ResourceLocationID`, `ResourceTypeID`, `Quantity`, `ResourceTypeUnitOfMeasureID`) VALUES ('10', '5', '1', '14');

INSERT INTO `helpnow`.`TransportType` (`Description`) VALUES ('Air');
INSERT INTO `helpnow`.`TransportType` (`Description`) VALUES ('Ground');
INSERT INTO `helpnow`.`TransportType` (`Description`) VALUES ('Water');

INSERT INTO `helpnow`.`ResourceLocationTransport` (`ResourceLocationID`, `TransportTypeID`) VALUES ('1', '1');
INSERT INTO `helpnow`.`ResourceLocationTransport` (`ResourceLocationID`, `TransportTypeID`) VALUES ('1', '2');
INSERT INTO `helpnow`.`ResourceLocationTransport` (`ResourceLocationID`, `TransportTypeID`) VALUES ('2', '1');
INSERT INTO `helpnow`.`ResourceLocationTransport` (`ResourceLocationID`, `TransportTypeID`) VALUES ('2', '3');
INSERT INTO `helpnow`.`ResourceLocationTransport` (`ResourceLocationID`, `TransportTypeID`) VALUES ('3', '2');
INSERT INTO `helpnow`.`ResourceLocationTransport` (`ResourceLocationID`, `TransportTypeID`) VALUES ('4', '1');
INSERT INTO `helpnow`.`ResourceLocationTransport` (`ResourceLocationID`, `TransportTypeID`) VALUES ('4', '2');
INSERT INTO `helpnow`.`ResourceLocationTransport` (`ResourceLocationID`, `TransportTypeID`) VALUES ('5', '2');
INSERT INTO `helpnow`.`ResourceLocationTransport` (`ResourceLocationID`, `TransportTypeID`) VALUES ('5', '3');
INSERT INTO `helpnow`.`ResourceLocationTransport` (`ResourceLocationID`, `TransportTypeID`) VALUES ('6', '1');
INSERT INTO `helpnow`.`ResourceLocationTransport` (`ResourceLocationID`, `TransportTypeID`) VALUES ('6', '2');
INSERT INTO `helpnow`.`ResourceLocationTransport` (`ResourceLocationID`, `TransportTypeID`) VALUES ('6', '3');
INSERT INTO `helpnow`.`ResourceLocationTransport` (`ResourceLocationID`, `TransportTypeID`) VALUES ('7', '2');
INSERT INTO `helpnow`.`ResourceLocationTransport` (`ResourceLocationID`, `TransportTypeID`) VALUES ('8', '1');
INSERT INTO `helpnow`.`ResourceLocationTransport` (`ResourceLocationID`, `TransportTypeID`) VALUES ('8', '2');

INSERT INTO `helpnow`.`InviteRequest` (`OrganizationID`, `FirstName`, `LastName`, `Email`, `CreateDate`) VALUES ('1', 'Paul', 'Smith', 'paulsmith@unitedway.org', CURDATE());

INSERT INTO `helpnow`.`BlockageSource` (`Description`) VALUES ('HelpNow');
INSERT INTO `helpnow`.`BlockageSource` (`Description`) VALUES ('Tomnod');

INSERT INTO `helpnow`.`Blockage` (`EventID`, `BlockageSourceID`, `LAT`, `LONG`, `Description`) VALUES ('1', '1', '23.710', '90.40','Road Block 1');
INSERT INTO `helpnow`.`Blockage` (`EventID`, `BlockageSourceID`, `LAT`, `LONG`, `Description`) VALUES ('1', '1', '23.709', '90.39','Road Block 2');
INSERT INTO `helpnow`.`Blockage` (`EventID`, `BlockageSourceID`, `LAT`, `LONG`, `Description`) VALUES ('1', '1', '23.713', '90.38','Road Block 3');
INSERT INTO `helpnow`.`Blockage` (`EventID`, `BlockageSourceID`, `LAT`, `LONG`, `Description`) VALUES ('1', '1', '23.715', '90.42','Bridge Out 1');
INSERT INTO `helpnow`.`Blockage` (`EventID`, `BlockageSourceID`, `LAT`, `LONG`, `Description`) VALUES ('1', '1', '23.711', '90.37','Bridge Out 2');
INSERT INTO `helpnow`.`Blockage` (`EventID`, `BlockageSourceID`, `LAT`, `LONG`, `Description`) VALUES ('1', '1', '23.709', '90.36','Bridge Out 3');
INSERT INTO `helpnow`.`Blockage` (`EventID`, `BlockageSourceID`, `LAT`, `LONG`, `Description`) VALUES ('1', '1', '23.712', '90.40','Bridge Out 4');
# inactive event blockages, for testing
INSERT INTO `helpnow`.`Blockage` (`EventID`, `BlockageSourceID`, `LAT`, `LONG`, `Description`) VALUES ('0', '1', '23.710', '90.40','Inactive Event Blockage 1');
INSERT INTO `helpnow`.`Blockage` (`EventID`, `BlockageSourceID`, `LAT`, `LONG`, `Description`) VALUES ('0', '1', '23.711', '90.41','Inactive Event Blockage 2');
INSERT INTO `helpnow`.`Blockage` (`EventID`, `BlockageSourceID`, `LAT`, `LONG`, `Description`) VALUES ('0', '1', '23.712', '90.42','Inactive Event Blockage 3');
INSERT INTO `helpnow`.`Blockage` (`EventID`, `BlockageSourceID`, `LAT`, `LONG`, `Description`) VALUES ('0', '1', '23.713', '90.43','Inactive Event Blockage 4');

INSERT INTO `helpnow`.`MapLayer` (`Name`, `OrganizationID`, `MapLayerTypeID`, `ImageryURL`, `MaxZoomLevel`, `MinZoomLevel`, `AttributionText`, `IsEsri`, `IsTSM`) VALUES ('Base Open Street Maps', '1', '1', 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', '18', '2', 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>', '0', '0');
INSERT INTO `helpnow`.`MapLayer` (`Name`, `OrganizationID`, `MapLayerTypeID`, `ImageryURL`, `MaxZoomLevel`, `MinZoomLevel`, `AttributionText`, `IsEsri`, `IsTSM`, `EventID`) VALUES ('Bangladesh (DG)', '1', '2', 'http://www.helpnowmap.com/bangladeshdg/{z}/{x}/{y}.png', '19', '11', '(c) <a href="http://www.digitalglobe.com/">DigitalGlobe</a>', '0', '0', '1');
INSERT INTO `helpnow`.`MapLayer` (`Name`, `OrganizationID`, `MapLayerTypeID`, `ImageryURL`, `MaxZoomLevel`, `MinZoomLevel`, `AttributionText`, `IsEsri`, `IsTSM`, `EventID`) VALUES ('Bangladesh', '1', '2', 'http://www.helpnowmap.com/bangladesh/{z}/{x}/{y}.png', '12', '6', '(c) <a href="http://www.dmcii.com/">DMC International Imaging</a>', '0', '1', '1');
INSERT INTO `helpnow`.`MapLayer` (`Name`, `OrganizationID`, `MapLayerTypeID`, `ImageryURL`, `MaxZoomLevel`, `MinZoomLevel`, `AttributionText`, `IsEsri`, `IsTSM`, `EventID`) VALUES ('Nepal (DG)', '1', '2', 'http://www.helpnowmap.com/nepal/{z}/{x}/{y}.png', '19', '11', '(c) <a href="http://www.digitalglobe.com/">DigitalGlobe</a>', '0', '0', '1');

INSERT INTO `helpnow`.`MapLayerType` (`Description`) VALUES ('Base Map');
INSERT INTO `helpnow`.`MapLayerType` (`Description`) VALUES ('Map Overlay');

SET foreign_key_checks=1;
