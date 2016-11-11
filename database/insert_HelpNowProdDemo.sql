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

INSERT INTO `helpnow`.`Account` (`Username`, `LastName`, `FirstName`, `Email`, `Password`, `AccountRoleID`, `CreateDate`, `OrganizationID`, `Active`) VALUES ('tuser', 'User', 'Test', 'test.user@testemail.com', 'testuser', 1, CURDATE(), 2, 1);


INSERT INTO `helpnow`.`Account` (`Username`, `LastName`, `FirstName`, `Email`, `Password`, `AccountRoleID`, `OrganizationID`, `Active`) VALUES ('meal', 'Meal', 'Aid', 'meal.aid@notvalidemail.com', 'demodemo', 1, 4, 1);
INSERT INTO `helpnow`.`Account` (`Username`, `LastName`, `FirstName`, `Email`, `Password`, `AccountRoleID`, `OrganizationID`, `Active`) VALUES ('health', 'Health', 'Aid', 'health.aid@notvalidemail.com', 'demodemo', 1, 5, 1);
INSERT INTO `helpnow`.`Account` (`Username`, `LastName`, `FirstName`, `Email`, `Password`, `AccountRoleID`, `OrganizationID`, `Active`) VALUES ('global', 'Global', 'Aid', 'global.aid@notvalidemail.com', 'demodemo', 1, 6, 1);
INSERT INTO `helpnow`.`Account` (`Username`, `LastName`, `FirstName`, `Email`, `Password`, `AccountRoleID`, `OrganizationID`, `Active`) VALUES ('home', 'Home', 'Aid', 'home.aid@notvalidemail.com', 'demodemo', 1, 7, 1);
INSERT INTO `helpnow`.`Account` (`Username`, `LastName`, `FirstName`, `Email`, `Password`, `AccountRoleID`, `OrganizationID`, `Active`) VALUES ('safe', 'Safe', 'Aid', 'safe.aid@notvalidemail.com', 'demodemo', 1, 8, 1);
INSERT INTO `helpnow`.`Account` (`Username`, `LastName`, `FirstName`, `Email`, `Password`, `AccountRoleID`, `OrganizationID`, `Active`) VALUES ('universal', 'Universal', 'Aid', 'universal.aid@notvalidemail.com', 'demodemo', 1, 9, 1);


INSERT INTO `helpnow`.`Address` (`StreetNumber`, `StreetName`, `StreetType`, `MajorMunicipality`, `GoverningDistrict`, `PostalArea`, `Country`) VALUES ('12999', 'Deer Creek Canyon', 'Road', 'Littleton', 'CO', '80217', 'United States of America');
INSERT INTO `helpnow`.`Address` (`StreetName`, `StreetType`, `MajorMunicipality`, `MinorMunicipality`, `PostalArea`, `Country`) VALUES ('Bir Uttam Ziaur Rahman Rd', 'Road', 'Dhaka', 'Elenbari', '1215', 'Bangladesh');
INSERT INTO `helpnow`.`Address` (`StreetName`, `StreetType`, `MajorMunicipality`, `MinorMunicipality`, `PostalArea`, `Country`) VALUES ('Putalisadak', 'Road', 'Kathmandu', 'Kathmandu', '44600', 'Nepal');

INSERT INTO `helpnow`.`OrganizationType` (`OrganizationTypeID`, `Description`) VALUES ('1', 'Government');
INSERT INTO `helpnow`.`OrganizationType` (`OrganizationTypeID`, `Description`) VALUES ('2', 'NGO');
INSERT INTO `helpnow`.`OrganizationType` (`OrganizationTypeID`, `Description`) VALUES ('3', 'App');

INSERT INTO `helpnow`.`Organization` (`Name`, `OrganizationTypeID`, `APIKey`, `APISecret`, `Active`) VALUES ('HelpNow', '3', ‘12345678-1234-1234-1234-123456789012', 'changethis', 1);
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

INSERT INTO `helpnow`.`Organization` (`Name`, `OrganizationTypeID`, `AddressID`, `PrimaryPOC`, `SecondaryPOC`, `Active`) VALUES ('Bangladesh Gov.', '1', '2', '1', '2', 1);
INSERT INTO `helpnow`.`Organization` (`Name`, `OrganizationTypeID`, `AddressID`, `PrimaryPOC`, `SecondaryPOC`, `Active`) VALUES ('Nepal Gov.', '1', '3', '1', '2', 1);
INSERT INTO `helpnow`.`Organization` (`Name`, `OrganizationTypeID`, `AddressID`, `PrimaryPOC`, `SecondaryPOC`, `Active`) VALUES ('Meal Aid', '2', '1', '3', '6', 1);
INSERT INTO `helpnow`.`Organization` (`Name`, `OrganizationTypeID`, `AddressID`, `PrimaryPOC`, `SecondaryPOC`, `Active`) VALUES ('Health Aid', '2', '1', '4', '3', 1);
INSERT INTO `helpnow`.`Organization` (`Name`, `OrganizationTypeID`, `AddressID`, `PrimaryPOC`, `SecondaryPOC`, `Active`) VALUES ('Global Aid', '1', '1', '5', '4', 1);
INSERT INTO `helpnow`.`Organization` (`Name`, `OrganizationTypeID`, `AddressID`, `PrimaryPOC`, `SecondaryPOC`, `Active`) VALUES ('Home Aid', '2', '1', '6', '9', 1);
INSERT INTO `helpnow`.`Organization` (`Name`, `OrganizationTypeID`, `AddressID`, `PrimaryPOC`, `SecondaryPOC`, `Active`) VALUES ('Safe Aid', '2', '1', '7', '8', 1);
INSERT INTO `helpnow`.`Organization` (`Name`, `OrganizationTypeID`, `AddressID`, `PrimaryPOC`, `SecondaryPOC`, `Active`) VALUES ('Universal Aid', '2', '1', '8', '7', 1);

INSERT INTO `helpnow`.`EventType` (`EventTypeID`, `Description`) VALUES ('1', 'Flood');
INSERT INTO `helpnow`.`EventType` (`EventTypeID`, `Description`) VALUES ('2', 'Tsunami');
INSERT INTO `helpnow`.`EventType` (`EventTypeID`, `Description`) VALUES ('3', 'Earthquake');
INSERT INTO `helpnow`.`EventType` (`EventTypeID`, `Description`) VALUES ('4', 'Hurricane');
INSERT INTO `helpnow`.`EventType` (`EventTypeID`, `Description`) VALUES ('5', 'Typhoon');

INSERT INTO `helpnow`.`Event` (`EventID`, `EventTypeID`, `OrganizationID`, `Summary`, `Active`, `CreateDate`, `Keywords`) VALUES ('1', '1', '1', 'Dhaka, Bangladesh', '1', CURDATE(), '#HelpNow, #DhakaFlood');
INSERT INTO `helpnow`.`Event` (`EventID`, `EventTypeID`, `OrganizationID`, `Summary`, `Active`, `CreateDate`, `Keywords`) VALUES ('2', '3', '2', 'Kathmandu, Nepal', '1', CURDATE(), '#HelpNow, #NepalEarthquake');

INSERT INTO `helpnow`.`EventLocation` (`EventLocationID`, `EventID`, `Description`, `LAT`, `LONG`, `Radius`) VALUES ('1', '1', 'Dhaka, Bangladesh', '23.713', '90.39', '542');
INSERT INTO `helpnow`.`EventLocation` (`EventLocationID`, `EventID`, `Description`, `LAT`, `LONG`, `Radius`) VALUES ('2', '2', 'Kathmandu, Nepal', '27.702', '85.313', '1024');

INSERT INTO `helpnow`.`ResourceType` (`Description`) VALUES ('Food');
INSERT INTO `helpnow`.`ResourceType` (`Description`) VALUES ('Water');
INSERT INTO `helpnow`.`ResourceType` (`Description`) VALUES ('Shelter');
INSERT INTO `helpnow`.`ResourceType` (`Description`) VALUES ('First Aid');
INSERT INTO `helpnow`.`ResourceType` (`Description`) VALUES ('Clothing');
INSERT INTO `helpnow`.`ResourceType` (`Description`) VALUES ('Medicine');
INSERT INTO `helpnow`.`ResourceType` (`Description`) VALUES ('Evacuation');
INSERT INTO `helpnow`.`ResourceType` (`Description`) VALUES ('Rescue');

INSERT INTO `helpnow`.`RequestState` (`RequestStateID`, `Description`) VALUES ('1', 'Active');
INSERT INTO `helpnow`.`RequestState` (`RequestStateID`, `Description`) VALUES ('2', 'Resolved');

INSERT INTO `helpnow`.`RequestUrgency` (`Level`, `Description`) VALUES ('1', 'Low');
INSERT INTO `helpnow`.`RequestUrgency` (`Level`, `Description`) VALUES ('2', 'Medium');
INSERT INTO `helpnow`.`RequestUrgency` (`Level`, `Description`) VALUES ('3', 'High');
INSERT INTO `helpnow`.`RequestUrgency` (`Level`, `Description`) VALUES ('4', 'Critical');
INSERT INTO `helpnow`.`RequestUrgency` (`Level`, `Description`) VALUES ('5', 'Immediate Danger');

INSERT INTO `helpnow`.`ResourceLocationType` (`Description`) VALUES ('Distribution Center');
INSERT INTO `helpnow`.`ResourceLocationType` (`Description`) VALUES ('Deployment');

INSERT INTO `helpnow`.`ResourceLocationStatus` (`ResourceLocationStatusID`, `Status`) VALUES ('1', 'Planned');
INSERT INTO `helpnow`.`ResourceLocationStatus` (`ResourceLocationStatusID`, `Status`) VALUES ('2', 'Active');

INSERT INTO `helpnow`.`ResourceLocation` (`OrganizationID`, `ResourceLocationTypeID`, `EventID`, `Description`, `Notes`, `LAT`, `LONG`, `PrimaryPOCName`, `PrimaryPOCPhone`, `SecondaryPOCName`, `SecondaryPOCPhone`, `ResourceLocationStatusID`) VALUES ('2','1','1','Emergency Dist. A','Government Emergency Distribution Center Site', '23.72429', '90.3697','Abu Khan', '+880 2 555 5555', '', '', '2');
INSERT INTO `helpnow`.`ResourceLocation` (`OrganizationID`, `ResourceLocationTypeID`, `EventID`, `Description`, `Notes`, `LAT`, `LONG`, `PrimaryPOCName`, `PrimaryPOCPhone`, `SecondaryPOCName`, `SecondaryPOCPhone`, `ResourceLocationStatusID`) VALUES ('2','1','1','Emergency Dist. B','Government Emergency Distribution Center Site', '23.80419', '90.37966','Abu Khan', '+880 2 555 5555', '', '', '2');

INSERT INTO `helpnow`.`ResourceLocation` (`OrganizationID`, `ResourceLocationTypeID`, `EventID`, `Description`, `Notes`, `LAT`, `LONG`, `PrimaryPOCName`, `PrimaryPOCPhone`, `SecondaryPOCName`, `SecondaryPOCPhone`, `ResourceLocationStatusID`) VALUES ('3','1','2','Emergency Dist. A','Government Emergency Distribution Center Site', '27.68435', '85.29522','Bishal Tamang', '+977 2 555 5555', '', '', '2');
INSERT INTO `helpnow`.`ResourceLocation` (`OrganizationID`, `ResourceLocationTypeID`, `EventID`, `Description`, `Notes`, `LAT`, `LONG`, `PrimaryPOCName`, `PrimaryPOCPhone`, `SecondaryPOCName`, `SecondaryPOCPhone`, `ResourceLocationStatusID`) VALUES ('3','1','2','Emergency Dist. B','Government Emergency Distribution Center Site', '27.69461', '85.32505','Bishal Tamang', '+977 2 555 5555', '', '', '2');

INSERT INTO `helpnow`.`ResourceLocation` (`OrganizationID`, `ResourceLocationTypeID`, `EventID`, `Description`, `Notes`, `LAT`, `LONG`, `PrimaryPOCName`, `PrimaryPOCPhone`, `SecondaryPOCName`, `SecondaryPOCPhone`, `ResourceLocationStatusID`) VALUES ('4','1','1','Ground Food Store A','Humanitarian Food Store', '23.77755', '90.38704', 'John Smith', '+1 555 555 5555', '', '', '2');
INSERT INTO `helpnow`.`ResourceLocation` (`OrganizationID`, `ResourceLocationTypeID`, `EventID`, `Description`, `Notes`, `LAT`, `LONG`, `PrimaryPOCName`, `PrimaryPOCPhone`, `SecondaryPOCName`, `SecondaryPOCPhone`, `ResourceLocationStatusID`) VALUES ('4','1','1','Ground Food Store B','Humanitarian Food Store', '23.85671', '90.40431', 'Daniel Jones', '+1 555 555 5555', '', '', '2');
INSERT INTO `helpnow`.`ResourceLocation` (`OrganizationID`, `ResourceLocationTypeID`, `EventID`, `Description`, `Notes`, `LAT`, `LONG`, `PrimaryPOCName`, `PrimaryPOCPhone`, `SecondaryPOCName`, `SecondaryPOCPhone`, `ResourceLocationStatusID`) VALUES ('4','1','2','Food Drop A','Humanitarian Food Dist. Site', '27.69655', '85.36342', 'Mike Johnson', '+1 555 555 5555', '', '', '2');

INSERT INTO `helpnow`.`ResourceLocation` (`OrganizationID`, `ResourceLocationTypeID`, `EventID`, `Description`, `Notes`, `LAT`, `LONG`, `PrimaryPOCName`, `PrimaryPOCPhone`, `SecondaryPOCName`, `SecondaryPOCPhone`, `ResourceLocationStatusID`) VALUES ('5','1','1','Aid Supply Site','First Aid Supply Site', '23.85321', '90.40052', 'Chris Lee', '+1 555 555 5555', '', '', '2');
INSERT INTO `helpnow`.`ResourceLocation` (`OrganizationID`, `ResourceLocationTypeID`, `EventID`, `Description`, `Notes`, `LAT`, `LONG`, `PrimaryPOCName`, `PrimaryPOCPhone`, `SecondaryPOCName`, `SecondaryPOCPhone`, `ResourceLocationStatusID`) VALUES ('5','1','2','Aid Supply Site','First Aid Supply Site', '27.63398', '85.51578', 'Mariah Brown', '+1 555 555 5555', '', '', '2');

INSERT INTO `helpnow`.`ResourceLocation` (`OrganizationID`, `ResourceLocationTypeID`, `EventID`, `Description`, `Notes`, `LAT`, `LONG`, `PrimaryPOCName`, `PrimaryPOCPhone`, `SecondaryPOCName`, `SecondaryPOCPhone`, `ResourceLocationStatusID`) VALUES ('6','1','1','Airport Site','Humanitarian Staging Site', '23.83977', '90.41185', 'Laura Williams', '+1 555 555 5555', '', '', '2');
INSERT INTO `helpnow`.`ResourceLocation` (`OrganizationID`, `ResourceLocationTypeID`, `EventID`, `Description`, `Notes`, `LAT`, `LONG`, `PrimaryPOCName`, `PrimaryPOCPhone`, `SecondaryPOCName`, `SecondaryPOCPhone`, `ResourceLocationStatusID`) VALUES ('6','1','1','Dock Site','Humanitarian Staging Site', '23.60939', '90.61122', 'Paul Rodriguez', '+1 555 555 5555', '', '', '2');
INSERT INTO `helpnow`.`ResourceLocation` (`OrganizationID`, `ResourceLocationTypeID`, `EventID`, `Description`, `Notes`, `LAT`, `LONG`, `PrimaryPOCName`, `PrimaryPOCPhone`, `SecondaryPOCName`, `SecondaryPOCPhone`, `ResourceLocationStatusID`) VALUES ('6','1','2','Airport Site','Humanitarian Staging Site', '27.68918', '85.35292', 'Andrea Martin', '+1 555 555 5555', '', '', '2');

INSERT INTO `helpnow`.`ResourceLocation` (`OrganizationID`, `ResourceLocationTypeID`, `EventID`, `Description`, `Notes`, `LAT`, `LONG`, `PrimaryPOCName`, `PrimaryPOCPhone`, `SecondaryPOCName`, `SecondaryPOCPhone`, `ResourceLocationStatusID`) VALUES ('7','1','1','Shipyard Dist','Humanitarian Staging Site', '23.62341', '90.62376', 'David Miller', '+1 555 555 5555', '', '', '2');
INSERT INTO `helpnow`.`ResourceLocation` (`OrganizationID`, `ResourceLocationTypeID`, `EventID`, `Description`, `Notes`, `LAT`, `LONG`, `PrimaryPOCName`, `PrimaryPOCPhone`, `SecondaryPOCName`, `SecondaryPOCPhone`, `ResourceLocationStatusID`) VALUES ('7','1','2','Distribution Site','Humanitarian Staging Site', '27.7056', '85.35882', 'Jon Taylor', '+1 555 555 5555', '', '', '2');

INSERT INTO `helpnow`.`ResourceLocation` (`OrganizationID`, `ResourceLocationTypeID`, `EventID`, `Description`, `Notes`, `LAT`, `LONG`, `PrimaryPOCName`, `PrimaryPOCPhone`, `SecondaryPOCName`, `SecondaryPOCPhone`, `ResourceLocationStatusID`) VALUES ('8','1','1','First Responder Staging','Rescue Staging Site', '23.78517', '90.3807', 'Lisa Sanchez', '+1 555 555 5555', '', '', '2');
INSERT INTO `helpnow`.`ResourceLocation` (`OrganizationID`, `ResourceLocationTypeID`, `EventID`, `Description`, `Notes`, `LAT`, `LONG`, `PrimaryPOCName`, `PrimaryPOCPhone`, `SecondaryPOCName`, `SecondaryPOCPhone`, `ResourceLocationStatusID`) VALUES ('8','1','2','First Responder Staging','Rescue Staging Site', '27.69676', '85.25652', 'John Perez', '+1 555 555 5555', '', '', '2');

INSERT INTO `helpnow`.`ResourceLocation` (`OrganizationID`, `ResourceLocationTypeID`, `EventID`, `Description`, `Notes`, `LAT`, `LONG`, `PrimaryPOCName`, `PrimaryPOCPhone`, `SecondaryPOCName`, `SecondaryPOCPhone`, `ResourceLocationStatusID`) VALUES ('9','1','1','Airport Staging','Humanitarian Staging Site', '23.77363', '90.38915', 'Kevin Jones', '+1 555 555 5555', '', '', '2');
INSERT INTO `helpnow`.`ResourceLocation` (`OrganizationID`, `ResourceLocationTypeID`, `EventID`, `Description`, `Notes`, `LAT`, `LONG`, `PrimaryPOCName`, `PrimaryPOCPhone`, `SecondaryPOCName`, `SecondaryPOCPhone`, `ResourceLocationStatusID`) VALUES ('9','1','1','Port Staging','Humanitarian Staging Site', '23.57026', '90.52355', 'Peter Martinez', '+1 555 555 5555', '', '', '2');
INSERT INTO `helpnow`.`ResourceLocation` (`OrganizationID`, `ResourceLocationTypeID`, `EventID`, `Description`, `Notes`, `LAT`, `LONG`, `PrimaryPOCName`, `PrimaryPOCPhone`, `SecondaryPOCName`, `SecondaryPOCPhone`, `ResourceLocationStatusID`) VALUES ('9','1','2','Supply Staging','Humanitarian Staging Site', '27.66444', '85.43875', 'Sarah Lee', '+1 555 555 5555', '', '', '2');
INSERT INTO `helpnow`.`ResourceLocation` (`OrganizationID`, `ResourceLocationTypeID`, `EventID`, `Description`, `Notes`, `LAT`, `LONG`, `PrimaryPOCName`, `PrimaryPOCPhone`, `SecondaryPOCName`, `SecondaryPOCPhone`, `ResourceLocationStatusID`) VALUES ('9','1','2','Airport Staging','Humanitarian Staging Site', '27.67506', '85.34947', 'Jason Smith', '+1 555 555 5555', '', '', '2');

INSERT INTO `helpnow`.`ResourceTypeUnitOfMeasure` (`ResourceTypeID`, `Description`) VALUES ('1', 'Liters');
INSERT INTO `helpnow`.`ResourceTypeUnitOfMeasure` (`ResourceTypeID`, `Description`) VALUES ('1', 'Bottles');
INSERT INTO `helpnow`.`ResourceTypeUnitOfMeasure` (`ResourceTypeID`, `Description`) VALUES ('1', 'Ounces');
INSERT INTO `helpnow`.`ResourceTypeUnitOfMeasure` (`ResourceTypeID`, `Description`) VALUES ('1', 'Gallons');
INSERT INTO `helpnow`.`ResourceTypeUnitOfMeasure` (`ResourceTypeID`, `Description`) VALUES ('2', 'MREs');
INSERT INTO `helpnow`.`ResourceTypeUnitOfMeasure` (`ResourceTypeID`, `Description`) VALUES ('2', 'Bushel');
INSERT INTO `helpnow`.`ResourceTypeUnitOfMeasure` (`ResourceTypeID`, `Description`) VALUES ('2', 'Meal');
INSERT INTO `helpnow`.`ResourceTypeUnitOfMeasure` (`ResourceTypeID`, `Description`) VALUES ('2', 'Bag');
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

INSERT INTO `helpnow`.`ResourceLocationInventory` (`ResourceLocationID`, `ResourceTypeID`, `Quantity`, `ResourceTypeUnitOfMeasureID`) VALUES ('1', '1', '500', '7');
INSERT INTO `helpnow`.`ResourceLocationInventory` (`ResourceLocationID`, `ResourceTypeID`, `Quantity`, `ResourceTypeUnitOfMeasureID`) VALUES ('1', '2', '1000', '1');
INSERT INTO `helpnow`.`ResourceLocationInventory` (`ResourceLocationID`, `ResourceTypeID`, `Quantity`, `ResourceTypeUnitOfMeasureID`) VALUES ('1', '3', '200', '9');
INSERT INTO `helpnow`.`ResourceLocationInventory` (`ResourceLocationID`, `ResourceTypeID`, `Quantity`, `ResourceTypeUnitOfMeasureID`) VALUES ('1', '5', '250', '16');
INSERT INTO `helpnow`.`ResourceLocationInventory` (`ResourceLocationID`, `ResourceTypeID`, `Quantity`, `ResourceTypeUnitOfMeasureID`) VALUES ('2', '1', '250', '7');
INSERT INTO `helpnow`.`ResourceLocationInventory` (`ResourceLocationID`, `ResourceTypeID`, `Quantity`, `ResourceTypeUnitOfMeasureID`) VALUES ('2', '2', '500', '1');
INSERT INTO `helpnow`.`ResourceLocationInventory` (`ResourceLocationID`, `ResourceTypeID`, `Quantity`, `ResourceTypeUnitOfMeasureID`) VALUES ('2', '4', '10', '12');
INSERT INTO `helpnow`.`ResourceLocationInventory` (`ResourceLocationID`, `ResourceTypeID`, `Quantity`, `ResourceTypeUnitOfMeasureID`) VALUES ('2', '6', '50', '17');

INSERT INTO `helpnow`.`ResourceLocationInventory` (`ResourceLocationID`, `ResourceTypeID`, `Quantity`, `ResourceTypeUnitOfMeasureID`) VALUES ('3', '1', '500', '7');
INSERT INTO `helpnow`.`ResourceLocationInventory` (`ResourceLocationID`, `ResourceTypeID`, `Quantity`, `ResourceTypeUnitOfMeasureID`) VALUES ('3', '2', '1000', '1');
INSERT INTO `helpnow`.`ResourceLocationInventory` (`ResourceLocationID`, `ResourceTypeID`, `Quantity`, `ResourceTypeUnitOfMeasureID`) VALUES ('3', '3', '200', '9');
INSERT INTO `helpnow`.`ResourceLocationInventory` (`ResourceLocationID`, `ResourceTypeID`, `Quantity`, `ResourceTypeUnitOfMeasureID`) VALUES ('3', '5', '250', '16');
INSERT INTO `helpnow`.`ResourceLocationInventory` (`ResourceLocationID`, `ResourceTypeID`, `Quantity`, `ResourceTypeUnitOfMeasureID`) VALUES ('4', '1', '250', '7');
INSERT INTO `helpnow`.`ResourceLocationInventory` (`ResourceLocationID`, `ResourceTypeID`, `Quantity`, `ResourceTypeUnitOfMeasureID`) VALUES ('4', '2', '500', '1');
INSERT INTO `helpnow`.`ResourceLocationInventory` (`ResourceLocationID`, `ResourceTypeID`, `Quantity`, `ResourceTypeUnitOfMeasureID`) VALUES ('4', '4', '10', '12');
INSERT INTO `helpnow`.`ResourceLocationInventory` (`ResourceLocationID`, `ResourceTypeID`, `Quantity`, `ResourceTypeUnitOfMeasureID`) VALUES ('4', '6', '50', '17');

INSERT INTO `helpnow`.`ResourceLocationInventory` (`ResourceLocationID`, `ResourceTypeID`, `Quantity`, `ResourceTypeUnitOfMeasureID`) VALUES ('5', '1', '500', '7');
INSERT INTO `helpnow`.`ResourceLocationInventory` (`ResourceLocationID`, `ResourceTypeID`, `Quantity`, `ResourceTypeUnitOfMeasureID`) VALUES ('5', '2', '3000', '1');
INSERT INTO `helpnow`.`ResourceLocationInventory` (`ResourceLocationID`, `ResourceTypeID`, `Quantity`, `ResourceTypeUnitOfMeasureID`) VALUES ('6', '1', '600', '7');
INSERT INTO `helpnow`.`ResourceLocationInventory` (`ResourceLocationID`, `ResourceTypeID`, `Quantity`, `ResourceTypeUnitOfMeasureID`) VALUES ('6', '2', '1000', '1');
INSERT INTO `helpnow`.`ResourceLocationInventory` (`ResourceLocationID`, `ResourceTypeID`, `Quantity`, `ResourceTypeUnitOfMeasureID`) VALUES ('7', '1', '750', '7');
INSERT INTO `helpnow`.`ResourceLocationInventory` (`ResourceLocationID`, `ResourceTypeID`, `Quantity`, `ResourceTypeUnitOfMeasureID`) VALUES ('7', '2', '3000', '1');

INSERT INTO `helpnow`.`ResourceLocationInventory` (`ResourceLocationID`, `ResourceTypeID`, `Quantity`, `ResourceTypeUnitOfMeasureID`) VALUES ('8', '4', '20', '12');
INSERT INTO `helpnow`.`ResourceLocationInventory` (`ResourceLocationID`, `ResourceTypeID`, `Quantity`, `ResourceTypeUnitOfMeasureID`) VALUES ('8', '6', '200', '17');
INSERT INTO `helpnow`.`ResourceLocationInventory` (`ResourceLocationID`, `ResourceTypeID`, `Quantity`, `ResourceTypeUnitOfMeasureID`) VALUES ('9', '4', '20', '12');
INSERT INTO `helpnow`.`ResourceLocationInventory` (`ResourceLocationID`, `ResourceTypeID`, `Quantity`, `ResourceTypeUnitOfMeasureID`) VALUES ('9', '6', '200', '17');

INSERT INTO `helpnow`.`ResourceLocationInventory` (`ResourceLocationID`, `ResourceTypeID`, `Quantity`, `ResourceTypeUnitOfMeasureID`) VALUES ('10', '1', '500', '7');
INSERT INTO `helpnow`.`ResourceLocationInventory` (`ResourceLocationID`, `ResourceTypeID`, `Quantity`, `ResourceTypeUnitOfMeasureID`) VALUES ('10', '2', '1000', '1');
INSERT INTO `helpnow`.`ResourceLocationInventory` (`ResourceLocationID`, `ResourceTypeID`, `Quantity`, `ResourceTypeUnitOfMeasureID`) VALUES ('10', '3', '200', '9');
INSERT INTO `helpnow`.`ResourceLocationInventory` (`ResourceLocationID`, `ResourceTypeID`, `Quantity`, `ResourceTypeUnitOfMeasureID`) VALUES ('10', '5', '250', '16');
INSERT INTO `helpnow`.`ResourceLocationInventory` (`ResourceLocationID`, `ResourceTypeID`, `Quantity`, `ResourceTypeUnitOfMeasureID`) VALUES ('11', '1', '250', '7');
INSERT INTO `helpnow`.`ResourceLocationInventory` (`ResourceLocationID`, `ResourceTypeID`, `Quantity`, `ResourceTypeUnitOfMeasureID`) VALUES ('11', '2', '500', '1');
INSERT INTO `helpnow`.`ResourceLocationInventory` (`ResourceLocationID`, `ResourceTypeID`, `Quantity`, `ResourceTypeUnitOfMeasureID`) VALUES ('11', '4', '10', '12');
INSERT INTO `helpnow`.`ResourceLocationInventory` (`ResourceLocationID`, `ResourceTypeID`, `Quantity`, `ResourceTypeUnitOfMeasureID`) VALUES ('11', '6', '50', '17');
INSERT INTO `helpnow`.`ResourceLocationInventory` (`ResourceLocationID`, `ResourceTypeID`, `Quantity`, `ResourceTypeUnitOfMeasureID`) VALUES ('12', '1', '500', '7');
INSERT INTO `helpnow`.`ResourceLocationInventory` (`ResourceLocationID`, `ResourceTypeID`, `Quantity`, `ResourceTypeUnitOfMeasureID`) VALUES ('12', '2', '1000', '1');
INSERT INTO `helpnow`.`ResourceLocationInventory` (`ResourceLocationID`, `ResourceTypeID`, `Quantity`, `ResourceTypeUnitOfMeasureID`) VALUES ('12', '3', '200', '9');
INSERT INTO `helpnow`.`ResourceLocationInventory` (`ResourceLocationID`, `ResourceTypeID`, `Quantity`, `ResourceTypeUnitOfMeasureID`) VALUES ('12', '5', '250', '16');
INSERT INTO `helpnow`.`ResourceLocationInventory` (`ResourceLocationID`, `ResourceTypeID`, `Quantity`, `ResourceTypeUnitOfMeasureID`) VALUES ('12', '1', '250', '7');
INSERT INTO `helpnow`.`ResourceLocationInventory` (`ResourceLocationID`, `ResourceTypeID`, `Quantity`, `ResourceTypeUnitOfMeasureID`) VALUES ('12', '2', '500', '1');
INSERT INTO `helpnow`.`ResourceLocationInventory` (`ResourceLocationID`, `ResourceTypeID`, `Quantity`, `ResourceTypeUnitOfMeasureID`) VALUES ('12', '4', '10', '12');
INSERT INTO `helpnow`.`ResourceLocationInventory` (`ResourceLocationID`, `ResourceTypeID`, `Quantity`, `ResourceTypeUnitOfMeasureID`) VALUES ('12', '6', '50', '17');

INSERT INTO `helpnow`.`ResourceLocationInventory` (`ResourceLocationID`, `ResourceTypeID`, `Quantity`, `ResourceTypeUnitOfMeasureID`) VALUES ('13', '3', '200', '10');
INSERT INTO `helpnow`.`ResourceLocationInventory` (`ResourceLocationID`, `ResourceTypeID`, `Quantity`, `ResourceTypeUnitOfMeasureID`) VALUES ('13', '5', '1000', '16');
INSERT INTO `helpnow`.`ResourceLocationInventory` (`ResourceLocationID`, `ResourceTypeID`, `Quantity`, `ResourceTypeUnitOfMeasureID`) VALUES ('14', '3', '200', '10');
INSERT INTO `helpnow`.`ResourceLocationInventory` (`ResourceLocationID`, `ResourceTypeID`, `Quantity`, `ResourceTypeUnitOfMeasureID`) VALUES ('14', '5', '1000', '16');

INSERT INTO `helpnow`.`ResourceLocationInventory` (`ResourceLocationID`, `ResourceTypeID`, `Quantity`, `ResourceTypeUnitOfMeasureID`) VALUES ('15', '8', '3', '20');
INSERT INTO `helpnow`.`ResourceLocationInventory` (`ResourceLocationID`, `ResourceTypeID`, `Quantity`, `ResourceTypeUnitOfMeasureID`) VALUES ('15', '4', '8', '12');
INSERT INTO `helpnow`.`ResourceLocationInventory` (`ResourceLocationID`, `ResourceTypeID`, `Quantity`, `ResourceTypeUnitOfMeasureID`) VALUES ('16', '8', '3', '20');
INSERT INTO `helpnow`.`ResourceLocationInventory` (`ResourceLocationID`, `ResourceTypeID`, `Quantity`, `ResourceTypeUnitOfMeasureID`) VALUES ('16', '4', '8', '12');

INSERT INTO `helpnow`.`ResourceLocationInventory` (`ResourceLocationID`, `ResourceTypeID`, `Quantity`, `ResourceTypeUnitOfMeasureID`) VALUES ('17', '1', '500', '7');
INSERT INTO `helpnow`.`ResourceLocationInventory` (`ResourceLocationID`, `ResourceTypeID`, `Quantity`, `ResourceTypeUnitOfMeasureID`) VALUES ('17', '2', '1000', '1');
INSERT INTO `helpnow`.`ResourceLocationInventory` (`ResourceLocationID`, `ResourceTypeID`, `Quantity`, `ResourceTypeUnitOfMeasureID`) VALUES ('17', '3', '200', '9');
INSERT INTO `helpnow`.`ResourceLocationInventory` (`ResourceLocationID`, `ResourceTypeID`, `Quantity`, `ResourceTypeUnitOfMeasureID`) VALUES ('17', '5', '250', '16');
INSERT INTO `helpnow`.`ResourceLocationInventory` (`ResourceLocationID`, `ResourceTypeID`, `Quantity`, `ResourceTypeUnitOfMeasureID`) VALUES ('18', '1', '250', '7');
INSERT INTO `helpnow`.`ResourceLocationInventory` (`ResourceLocationID`, `ResourceTypeID`, `Quantity`, `ResourceTypeUnitOfMeasureID`) VALUES ('18', '2', '500', '1');
INSERT INTO `helpnow`.`ResourceLocationInventory` (`ResourceLocationID`, `ResourceTypeID`, `Quantity`, `ResourceTypeUnitOfMeasureID`) VALUES ('18', '4', '10', '12');
INSERT INTO `helpnow`.`ResourceLocationInventory` (`ResourceLocationID`, `ResourceTypeID`, `Quantity`, `ResourceTypeUnitOfMeasureID`) VALUES ('18', '6', '50', '17');
INSERT INTO `helpnow`.`ResourceLocationInventory` (`ResourceLocationID`, `ResourceTypeID`, `Quantity`, `ResourceTypeUnitOfMeasureID`) VALUES ('19', '1', '500', '7');
INSERT INTO `helpnow`.`ResourceLocationInventory` (`ResourceLocationID`, `ResourceTypeID`, `Quantity`, `ResourceTypeUnitOfMeasureID`) VALUES ('19', '2', '1000', '1');
INSERT INTO `helpnow`.`ResourceLocationInventory` (`ResourceLocationID`, `ResourceTypeID`, `Quantity`, `ResourceTypeUnitOfMeasureID`) VALUES ('19', '3', '200', '9');
INSERT INTO `helpnow`.`ResourceLocationInventory` (`ResourceLocationID`, `ResourceTypeID`, `Quantity`, `ResourceTypeUnitOfMeasureID`) VALUES ('19', '5', '250', '16');
INSERT INTO `helpnow`.`ResourceLocationInventory` (`ResourceLocationID`, `ResourceTypeID`, `Quantity`, `ResourceTypeUnitOfMeasureID`) VALUES ('20', '1', '250', '7');
INSERT INTO `helpnow`.`ResourceLocationInventory` (`ResourceLocationID`, `ResourceTypeID`, `Quantity`, `ResourceTypeUnitOfMeasureID`) VALUES ('20', '2', '500', '1');
INSERT INTO `helpnow`.`ResourceLocationInventory` (`ResourceLocationID`, `ResourceTypeID`, `Quantity`, `ResourceTypeUnitOfMeasureID`) VALUES ('20', '4', '10', '12');
INSERT INTO `helpnow`.`ResourceLocationInventory` (`ResourceLocationID`, `ResourceTypeID`, `Quantity`, `ResourceTypeUnitOfMeasureID`) VALUES ('20', '6', '50', '17');

INSERT INTO `helpnow`.`TransportType` (`Description`) VALUES ('Air');
INSERT INTO `helpnow`.`TransportType` (`Description`) VALUES ('Ground');
INSERT INTO `helpnow`.`TransportType` (`Description`) VALUES ('Water');

INSERT INTO `helpnow`.`ResourceLocationTransport` (`ResourceLocationID`, `TransportTypeID`) VALUES ('1', '2');
INSERT INTO `helpnow`.`ResourceLocationTransport` (`ResourceLocationID`, `TransportTypeID`) VALUES ('2', '2');

INSERT INTO `helpnow`.`ResourceLocationTransport` (`ResourceLocationID`, `TransportTypeID`) VALUES ('3', '2');
INSERT INTO `helpnow`.`ResourceLocationTransport` (`ResourceLocationID`, `TransportTypeID`) VALUES ('4', '2');

INSERT INTO `helpnow`.`ResourceLocationTransport` (`ResourceLocationID`, `TransportTypeID`) VALUES ('5', '2');
INSERT INTO `helpnow`.`ResourceLocationTransport` (`ResourceLocationID`, `TransportTypeID`) VALUES ('6', '2');
INSERT INTO `helpnow`.`ResourceLocationTransport` (`ResourceLocationID`, `TransportTypeID`) VALUES ('7', '2');
INSERT INTO `helpnow`.`ResourceLocationTransport` (`ResourceLocationID`, `TransportTypeID`) VALUES ('7', '1');

INSERT INTO `helpnow`.`ResourceLocationTransport` (`ResourceLocationID`, `TransportTypeID`) VALUES ('8', '2');
INSERT INTO `helpnow`.`ResourceLocationTransport` (`ResourceLocationID`, `TransportTypeID`) VALUES ('8', '1');
INSERT INTO `helpnow`.`ResourceLocationTransport` (`ResourceLocationID`, `TransportTypeID`) VALUES ('9', '2');

INSERT INTO `helpnow`.`ResourceLocationTransport` (`ResourceLocationID`, `TransportTypeID`) VALUES ('10', '2');
INSERT INTO `helpnow`.`ResourceLocationTransport` (`ResourceLocationID`, `TransportTypeID`) VALUES ('10', '1');
INSERT INTO `helpnow`.`ResourceLocationTransport` (`ResourceLocationID`, `TransportTypeID`) VALUES ('11', '2');
INSERT INTO `helpnow`.`ResourceLocationTransport` (`ResourceLocationID`, `TransportTypeID`) VALUES ('11', '3');
INSERT INTO `helpnow`.`ResourceLocationTransport` (`ResourceLocationID`, `TransportTypeID`) VALUES ('12', '2');
INSERT INTO `helpnow`.`ResourceLocationTransport` (`ResourceLocationID`, `TransportTypeID`) VALUES ('12', '1');

INSERT INTO `helpnow`.`ResourceLocationTransport` (`ResourceLocationID`, `TransportTypeID`) VALUES ('13', '2');
INSERT INTO `helpnow`.`ResourceLocationTransport` (`ResourceLocationID`, `TransportTypeID`) VALUES ('13', '3');
INSERT INTO `helpnow`.`ResourceLocationTransport` (`ResourceLocationID`, `TransportTypeID`) VALUES ('14', '2');

INSERT INTO `helpnow`.`ResourceLocationTransport` (`ResourceLocationID`, `TransportTypeID`) VALUES ('15', '2');
INSERT INTO `helpnow`.`ResourceLocationTransport` (`ResourceLocationID`, `TransportTypeID`) VALUES ('16', '2');
INSERT INTO `helpnow`.`ResourceLocationTransport` (`ResourceLocationID`, `TransportTypeID`) VALUES ('16', '1');

INSERT INTO `helpnow`.`ResourceLocationTransport` (`ResourceLocationID`, `TransportTypeID`) VALUES ('17', '2');
INSERT INTO `helpnow`.`ResourceLocationTransport` (`ResourceLocationID`, `TransportTypeID`) VALUES ('17', '1');
INSERT INTO `helpnow`.`ResourceLocationTransport` (`ResourceLocationID`, `TransportTypeID`) VALUES ('18', '2');
INSERT INTO `helpnow`.`ResourceLocationTransport` (`ResourceLocationID`, `TransportTypeID`) VALUES ('18', '3');
INSERT INTO `helpnow`.`ResourceLocationTransport` (`ResourceLocationID`, `TransportTypeID`) VALUES ('19', '2');
INSERT INTO `helpnow`.`ResourceLocationTransport` (`ResourceLocationID`, `TransportTypeID`) VALUES ('20', '2');
INSERT INTO `helpnow`.`ResourceLocationTransport` (`ResourceLocationID`, `TransportTypeID`) VALUES ('20', '1');

INSERT INTO `helpnow`.`InviteRequest` (`OrganizationID`, `FirstName`, `LastName`, `Email`, `CreateDate`) VALUES ('1', 'Paul', 'Smith', 'paulsmith@examplengo.org', CURDATE());

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

INSERT INTO `helpnow`.`MapLayer` (`Name`, `MapLayerTypeID`, `ImageryURL`, `MaxZoomLevel`, `MinZoomLevel`, `AttributionText`, `IsEsri`, `IsTSM`) VALUES ('Base Open Street Maps', '1', 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', '18', '2', 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery � <a href="http://mapbox.com">Mapbox</a>', '0', '0');

INSERT INTO `helpnow`.`MapLayer` (`Name`, `MapLayerTypeID`, `ImageryURL`, `MaxZoomLevel`, `MinZoomLevel`, `AttributionText`, `IsEsri`, `IsTSM`, `EventID`) VALUES ('Bangladesh (DG)', '2', 'http://www.helpnowmap.com/bangladeshdg/{z}/{x}/{y}.png', '19', '11', '(c) <a href="http://www.digitalglobe.com/">DigitalGlobe</a>', '0', '0', '1');
INSERT INTO `helpnow`.`MapLayer` (`Name`, `MapLayerTypeID`, `ImageryURL`, `MaxZoomLevel`, `MinZoomLevel`, `AttributionText`, `IsEsri`, `IsTSM`, `EventID`) VALUES ('Bangladesh', '2', 'http://www.helpnowmap.com/bangladesh/{z}/{x}/{y}.png', '12', '6', '(c) <a href="http://www.dmcii.com/">DMC International Imaging</a>', '0', '1', '1');
INSERT INTO `helpnow`.`MapLayer` (`Name`, `MapLayerTypeID`, `ImageryURL`, `MaxZoomLevel`, `MinZoomLevel`, `AttributionText`, `IsEsri`, `IsTSM`, `EventID`) VALUES ('Nepal (DG)', '2', 'http://www.helpnowmap.com/nepal/{z}/{x}/{y}.png', '19', '11', '(c) <a href="http://www.digitalglobe.com/">DigitalGlobe</a>', '0', '0', '2');

INSERT INTO `helpnow`.`MapLayerType` (`Description`) VALUES ('Base Map');
INSERT INTO `helpnow`.`MapLayerType` (`Description`) VALUES ('Map Overlay');

SET foreign_key_checks=1;
