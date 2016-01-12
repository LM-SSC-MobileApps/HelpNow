CREATE DEFINER=`root`@`localhost` PROCEDURE `drop_scenario_data`()
BEGIN
SET foreign_key_checks=0;
TRUNCATE helpnow.Event;
TRUNCATE helpnow.EventLocation;
#TRUNCATE helpnow.ResourceLocation;
TRUNCATE helpnow.ResourceRequest;
TRUNCATE helpnow.ResourceResponse;
END