define({ "api": [
  {
    "type": "delete",
    "url": "api/event/:id",
    "title": "Delete an Event",
    "name": "DeleteEvent",
    "group": "Event",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>The unique ID of the Event to delete</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "json",
            "description": "<p>the number of rows deleted.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "result",
            "description": "<p>Result message.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>Error message.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": " HTTP/1.1 200 OK\n{\n    \"result\": \"success\",\n    \"err\": \"\",\n    \"json\": {\n        \"rows\": 1\n    }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/event.js",
    "groupTitle": "Event",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Basic Authorization header with API Key &amp; API Secret.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "401",
            "description": "<p>Unauthorized.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "500",
            "description": "<p>Internal Server Error.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "500.result",
            "description": "<p>error.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "500.err",
            "description": "<p>Error Message.</p>"
          }
        ]
      }
    }
  },
  {
    "type": "get",
    "url": "api/event",
    "title": "Get all Events that are active",
    "name": "GetEvent",
    "group": "Event",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "json",
            "description": "<p>The Result data in the form of a json array.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "json.EventID",
            "description": "<p>Unique ID for the Event.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "json.EventTypeID",
            "description": "<p>Unique ID for the Event Type.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "json.OrganizationID",
            "description": "<p>OrganziationID associated with the Organization for the Event.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "json.Summary",
            "description": "<p>Event Title.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "json.Notes",
            "description": "<p>Event description or additional information.</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "json.Active",
            "description": "<p>Status of the event.</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "json.CreateDate",
            "description": "<p>Date &amp; Time the Event was created in the system.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "json.EventLocations",
            "description": "<p>An Array of EventLocations for the event.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "json.EventType",
            "description": "<p>the EventType object associated with the event.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "json.Organization",
            "description": "<p>the Organization object associated with the event.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "json.ResourceRequests",
            "description": "<p>An Array of ResourceRequests for the event.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "json.ResourceLocations",
            "description": "<p>An Array of ResourceLocations for the event.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "result",
            "description": "<p>Result message.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>Error message.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/event.js",
    "groupTitle": "Event",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Basic Authorization header with API Key &amp; API Secret.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "401",
            "description": "<p>Unauthorized.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "500",
            "description": "<p>Internal Server Error.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "500.result",
            "description": "<p>error.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "500.err",
            "description": "<p>Error Message.</p>"
          }
        ]
      }
    }
  },
  {
    "type": "get",
    "url": "api/event/:id",
    "title": "Get Event by EventID",
    "name": "GetEventByID",
    "group": "Event",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Event unique ID</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "json",
            "description": "<p>The Result data in the form of json.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "json.EventID",
            "description": "<p>Unique ID for the Event.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "json.EventTypeID",
            "description": "<p>Unique ID for the Event Type.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "json.OrganizationID",
            "description": "<p>OrganziationID associated with the Organization for the Event.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "json.Summary",
            "description": "<p>Event Title.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "json.Notes",
            "description": "<p>Event description or additional information.</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "json.Active",
            "description": "<p>Status of the event.</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "json.CreateDate",
            "description": "<p>Date &amp; Time the Event was created in the system.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "json.EventLocations",
            "description": "<p>An Array of EventLocations for the event.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "json.EventType",
            "description": "<p>the EventType object associated with the event.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "json.Organization",
            "description": "<p>the Organization object associated with the event.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "json.ResourceRequests",
            "description": "<p>An Array of ResourceRequests for the event.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "json.ResourceLocations",
            "description": "<p>An Array of ResourceLocations for the event.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "result",
            "description": "<p>Result message.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>Error message.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/event.js",
    "groupTitle": "Event",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Basic Authorization header with API Key &amp; API Secret.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "401",
            "description": "<p>Unauthorized.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "500",
            "description": "<p>Internal Server Error.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "500.result",
            "description": "<p>error.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "500.err",
            "description": "<p>Error Message.</p>"
          }
        ]
      }
    }
  },
  {
    "type": "get",
    "url": "api/event/mapitems/:eventID",
    "title": "Get map items by event ID",
    "name": "GetMapItems",
    "group": "Event",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "eventID",
            "description": "<p>Event unique ID</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "json",
            "description": "<p>The result data in the form of json.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "json.requestClusters",
            "description": "<p>an array of ResourceRequest Cluster objects .</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "json.requests",
            "description": "<p>an array of ResourceRequest objects.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "json.locations",
            "description": "<p>an array of ResourceLocation objects of type Deployment for the event.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "json.distributionCenters",
            "description": "<p>an array of ResourceLocation objects of type Distribution center for the event.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "result",
            "description": "<p>Result message.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>Error message.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/event.js",
    "groupTitle": "Event",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Basic Authorization header with API Key &amp; API Secret.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "401",
            "description": "<p>Unauthorized.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "500",
            "description": "<p>Internal Server Error.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "500.result",
            "description": "<p>error.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "500.err",
            "description": "<p>Error Message.</p>"
          }
        ]
      }
    }
  },
  {
    "type": "post",
    "url": "api/event/",
    "title": "Insert a new Event",
    "name": "PostEvent",
    "group": "Event",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "JSON",
            "optional": false,
            "field": "body",
            "description": "<p>representation of the Event object to insert in JSON format</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "body.EventTypeID",
            "description": "<p>An EventType ID for the EventType to be used</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "body.OrganizationID",
            "description": "<p>An Organization ID for the Organization to be used</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "body.Summary",
            "description": "<p>Short title/desciption of the event</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "body.Notes",
            "description": "<p>Additional information for the event.</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "body.Active",
            "description": "<p>Sets the state of the Event</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": false,
            "field": "body.CreateDate",
            "description": "<p>Date the event was created</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "json",
            "description": "<p>The Event object created from the insert.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "result",
            "description": "<p>Result message.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>Error message.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"result\": \"success\",\n  \"err\": \"\",\n  \"json\": \"<Event object>\",\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/event.js",
    "groupTitle": "Event",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Basic Authorization header with API Key &amp; API Secret.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "401",
            "description": "<p>Unauthorized.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "500",
            "description": "<p>Internal Server Error.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "500.result",
            "description": "<p>error.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "500.err",
            "description": "<p>Error Message.</p>"
          }
        ]
      }
    }
  },
  {
    "type": "put",
    "url": "api/event/:id",
    "title": "Update an Event",
    "name": "UpdateEvent",
    "group": "Event",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>The unique ID of the Event to update</p>"
          },
          {
            "group": "Parameter",
            "type": "JSON",
            "optional": false,
            "field": "body",
            "description": "<p>representation of the Event object to update in JSON format</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "json",
            "description": "<p>the number of rows updated.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "result",
            "description": "<p>Result message.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>Error message.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"result\": \"success\",\n    \"err\": \"\",\n    \"json\": {\n      \"rows\": [\n        1\n      ]\n    },\n    \"length\": 1\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/event.js",
    "groupTitle": "Event",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Basic Authorization header with API Key &amp; API Secret.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "401",
            "description": "<p>Unauthorized.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "500",
            "description": "<p>Internal Server Error.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "500.result",
            "description": "<p>error.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "500.err",
            "description": "<p>Error Message.</p>"
          }
        ]
      }
    }
  },
  {
    "type": "delete",
    "url": "api/organizationregulation/:id",
    "title": "Delete a OrganizationRegulation",
    "name": "DeleteOrganizationRegulation",
    "group": "OrganizationRegulation",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>The unique ID of the OrganizationRegulation to delete</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "json",
            "description": "<p>the number of rows deleted.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "result",
            "description": "<p>Result message.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>Error message.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": " HTTP/1.1 200 OK\n{\n    \"result\": \"success\",\n    \"err\": \"\",\n    \"json\": {\n        \"rows\": 1\n    }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/organizationregulation.js",
    "groupTitle": "OrganizationRegulation",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Basic Authorization header with API Key &amp; API Secret.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "401",
            "description": "<p>Unauthorized.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "500",
            "description": "<p>Internal Server Error.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "500.result",
            "description": "<p>error.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "500.err",
            "description": "<p>Error Message.</p>"
          }
        ]
      }
    }
  },
  {
    "type": "get",
    "url": "api/organizationregulation/account/:id",
    "title": "Get OrganizationRegulations by AccountID",
    "name": "GetOrganizationRegulationByAccountID",
    "group": "OrganizationRegulation",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Account unique ID</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "json",
            "description": "<p>The result data in the form of a json array of OrganizationRegulation objects.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "result",
            "description": "<p>Result message.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>Error message.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/organizationregulation.js",
    "groupTitle": "OrganizationRegulation",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Basic Authorization header with API Key &amp; API Secret.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "401",
            "description": "<p>Unauthorized.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "500",
            "description": "<p>Internal Server Error.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "500.result",
            "description": "<p>error.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "500.err",
            "description": "<p>Error Message.</p>"
          }
        ]
      }
    }
  },
  {
    "type": "get",
    "url": "api/organizationregulation/:id",
    "title": "Get OrganizationRegulation by OrganizationRegulationID",
    "name": "GetOrganizationRegulationByID",
    "group": "OrganizationRegulation",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>OrganizationRegulation unique ID</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "json",
            "description": "<p>The result data in the form of a json OrganizationRegulation object.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "result",
            "description": "<p>Result message.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>Error message.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/organizationregulation.js",
    "groupTitle": "OrganizationRegulation",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Basic Authorization header with API Key &amp; API Secret.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "401",
            "description": "<p>Unauthorized.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "500",
            "description": "<p>Internal Server Error.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "500.result",
            "description": "<p>error.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "500.err",
            "description": "<p>Error Message.</p>"
          }
        ]
      }
    }
  },
  {
    "type": "get",
    "url": "api/organizationregulation",
    "title": "Get all OrganizationRegulations",
    "name": "GetOrganizationRegulations",
    "group": "OrganizationRegulation",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "json",
            "description": "<p>The result data in the form of a json array of OrganizationRegulation objects.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "json.OrganizationRegulationsID",
            "description": "<p>The OrganizationRegulation ID for the OrganizationRegulation object.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "json.OrganizationID",
            "description": "<p>An Organization ID for the Organization associated</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "json.Summary",
            "description": "<p>Title/Description of the OrganizationRegulation</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "json.Narrative",
            "description": "<p>Text of the OrganizationRegulation</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "result",
            "description": "<p>Result message.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>Error message.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/organizationregulation.js",
    "groupTitle": "OrganizationRegulation",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Basic Authorization header with API Key &amp; API Secret.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "401",
            "description": "<p>Unauthorized.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "500",
            "description": "<p>Internal Server Error.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "500.result",
            "description": "<p>error.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "500.err",
            "description": "<p>Error Message.</p>"
          }
        ]
      }
    }
  },
  {
    "type": "post",
    "url": "api/organizationregulation/",
    "title": "Insert a new OrganizationRegulation",
    "name": "PostOrganizationRegulation",
    "group": "OrganizationRegulation",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "JSON",
            "optional": false,
            "field": "body",
            "description": "<p>representation of the OrganizationRegulations object to insert in JSON format</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "body.OrganizationID",
            "description": "<p>An RequestState ID for the RequestState to be used</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "body.Summary",
            "description": "<p>Title/Description of the OrganizationRegulation</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "body.Narrative",
            "description": "<p>Text of the OrganizationRegulation</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "json",
            "description": "<p>The OrganizationRegulations object created from the insert.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "result",
            "description": "<p>Result message.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>Error message.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"result\": \"success\",\n  \"err\": \"\",\n  \"json\": \"<OrganizationRegulation object>\",\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/organizationregulation.js",
    "groupTitle": "OrganizationRegulation",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Basic Authorization header with API Key &amp; API Secret.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "401",
            "description": "<p>Unauthorized.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "500",
            "description": "<p>Internal Server Error.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "500.result",
            "description": "<p>error.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "500.err",
            "description": "<p>Error Message.</p>"
          }
        ]
      }
    }
  },
  {
    "type": "put",
    "url": "api/organizationregulation/:id",
    "title": "Update an OrganizationRegulation",
    "name": "UpdateOrganizationRegulation",
    "group": "OrganizationRegulation",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>The unique ID of the OrganizationRegulation to update</p>"
          },
          {
            "group": "Parameter",
            "type": "JSON",
            "optional": false,
            "field": "body",
            "description": "<p>representation of the OrganizationRegulations object to update in JSON format</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "json",
            "description": "<p>the number of rows updated.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "result",
            "description": "<p>Result message.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>Error message.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"result\": \"success\",\n    \"err\": \"\",\n    \"json\": {\n      \"rows\": [\n        1\n      ]\n    },\n    \"length\": 1\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/organizationregulation.js",
    "groupTitle": "OrganizationRegulation",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Basic Authorization header with API Key &amp; API Secret.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "401",
            "description": "<p>Unauthorized.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "500",
            "description": "<p>Internal Server Error.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "500.result",
            "description": "<p>error.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "500.err",
            "description": "<p>Error Message.</p>"
          }
        ]
      }
    }
  },
  {
    "type": "delete",
    "url": "api/resourcelocation/:id",
    "title": "Delete a ResourceLocation",
    "name": "DeleteResourceLocation",
    "group": "ResourceLocation",
    "description": "<p>This will Delete the Resource Location along with any cascading objects (ResourceLocationInventory, ResourceLocationTypes, etc).</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>The unique ID of the ResourceLocation to delete</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "json",
            "description": "<p>the number of rows deleted.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "result",
            "description": "<p>Result message.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>Error message.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": " HTTP/1.1 200 OK\n{\n    \"result\": \"success\",\n    \"err\": \"\",\n    \"json\": {\n        \"rows\": 1\n    }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/resourcelocation.js",
    "groupTitle": "ResourceLocation",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Basic Authorization header with API Key &amp; API Secret.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "401",
            "description": "<p>Unauthorized.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "500",
            "description": "<p>Internal Server Error.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "500.result",
            "description": "<p>error.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "500.err",
            "description": "<p>Error Message.</p>"
          }
        ]
      }
    }
  },
  {
    "type": "get",
    "url": "api/resourcelocation/:id",
    "title": "Get ResourceLocation by ResourceLocationID",
    "name": "GetResourceLocationByID",
    "group": "ResourceLocation",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>ResourceLocation unique ID</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "json",
            "description": "<p>The result data in the form of a json ResourceLocation object.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "result",
            "description": "<p>Result message.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>Error message.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/resourcelocation.js",
    "groupTitle": "ResourceLocation",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Basic Authorization header with API Key &amp; API Secret.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "401",
            "description": "<p>Unauthorized.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "500",
            "description": "<p>Internal Server Error.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "500.result",
            "description": "<p>error.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "500.err",
            "description": "<p>Error Message.</p>"
          }
        ]
      }
    }
  },
  {
    "type": "get",
    "url": "api/resourcelocation/dist-center/all",
    "title": "Get All ResourceLocations of type Distribution Center",
    "name": "GetResourceLocationDistributionCenters",
    "group": "ResourceLocation",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "json",
            "description": "<p>The result data in the form of a json array of ResourceLocation objects.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "result",
            "description": "<p>Result message.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>Error message.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/resourcelocation.js",
    "groupTitle": "ResourceLocation",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Basic Authorization header with API Key &amp; API Secret.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "401",
            "description": "<p>Unauthorized.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "500",
            "description": "<p>Internal Server Error.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "500.result",
            "description": "<p>error.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "500.err",
            "description": "<p>Error Message.</p>"
          }
        ]
      }
    }
  },
  {
    "type": "get",
    "url": "api/resourcelocation/dist-center/organization/:orgid",
    "title": "Get All ResourceLocations of type Distribution Center by Organization ID",
    "name": "GetResourceLocationDistributionCentersByOrgID",
    "group": "ResourceLocation",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "orgid",
            "description": "<p>Organization unique ID</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "json",
            "description": "<p>The result data in the form of a json array of ResourceLocation objects.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "result",
            "description": "<p>Result message.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>Error message.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/resourcelocation.js",
    "groupTitle": "ResourceLocation",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Basic Authorization header with API Key &amp; API Secret.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "401",
            "description": "<p>Unauthorized.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "500",
            "description": "<p>Internal Server Error.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "500.result",
            "description": "<p>error.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "500.err",
            "description": "<p>Error Message.</p>"
          }
        ]
      }
    }
  },
  {
    "type": "get",
    "url": "api/resourcelocation",
    "title": "Get all ResourceLocations",
    "name": "GetResourceLocations",
    "group": "ResourceLocation",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "json",
            "description": "<p>The Result data in the form of a json array of ResourceLocation objects.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "json.ResourceLocationID",
            "description": "<p>The ResourceLocation ID for the ResourceLocation object.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "json.EventID",
            "description": "<p>An Event ID for the Event associated with the ResourceLocation</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "json.OrganizationID",
            "description": "<p>An Organization ID for the Organization associated with the ResourceLocation</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "json.ResourceLocationTypeID",
            "description": "<p>The ResourceLocationType ID for the ResourceLocation object.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "json.ResourceLocationStatusID",
            "description": "<p>The ResourceLocationStatus ID for the ResourceLocation object.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "json.Description",
            "description": "<p>Title/Description for the ResourceLocation</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "json.Notes",
            "description": "<p>General Information and notes for the ResourceLocation</p>"
          },
          {
            "group": "Success 200",
            "type": "Float",
            "optional": false,
            "field": "json.LAT",
            "description": "<p>Lattitude coordinate for the location of the ResourceLocation</p>"
          },
          {
            "group": "Success 200",
            "type": "Float",
            "optional": false,
            "field": "json.LONG",
            "description": "<p>Longitude coordinate for the location of the ResourceLocation</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "json.PrimaryPOCName",
            "description": "<p>Primary Point of Contact name for the ResourceLocation</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "json.PrimaryPOCPhone",
            "description": "<p>Primary Point of Contact phone number for the ResourceLocation</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "json.SecondaryPOCName",
            "description": "<p>Secondary Point of Contact name for the ResourceLocation</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "json.SecondaryPOCPhone",
            "description": "<p>Secondary Point of Contact phone number for the ResourceLocation</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "json.Event",
            "description": "<p>the Event object associated with the ResourceLocation.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "json.Organization",
            "description": "<p>the Organization object associated with the ResourceLocation.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "json.ResourceLocationType",
            "description": "<p>the ResourceLocationType object for the ResourceLocation.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "json.ResourceLocationInventories",
            "description": "<p>An Array of ResourceLocationInventory objects available at the ResourceLocation.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "json.ResourceLocationTransports",
            "description": "<p>An Array of ResourceLocationTransport objects available at the ResourceLocation.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "result",
            "description": "<p>Result message.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>Error message.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/resourcelocation.js",
    "groupTitle": "ResourceLocation",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Basic Authorization header with API Key &amp; API Secret.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "401",
            "description": "<p>Unauthorized.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "500",
            "description": "<p>Internal Server Error.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "500.result",
            "description": "<p>error.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "500.err",
            "description": "<p>Error Message.</p>"
          }
        ]
      }
    }
  },
  {
    "type": "get",
    "url": "api/resourcelocation/:orgid",
    "title": "Get ResourceLocations by OrganizationID",
    "name": "GetResourceLocationsByOrganizationID",
    "group": "ResourceLocation",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "orgid",
            "description": "<p>Organization unique ID</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "json",
            "description": "<p>The result data in the form of a json array of ResourceLocation objects.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "result",
            "description": "<p>Result message.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>Error message.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/resourcelocation.js",
    "groupTitle": "ResourceLocation",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Basic Authorization header with API Key &amp; API Secret.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "401",
            "description": "<p>Unauthorized.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "500",
            "description": "<p>Internal Server Error.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "500.result",
            "description": "<p>error.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "500.err",
            "description": "<p>Error Message.</p>"
          }
        ]
      }
    }
  },
  {
    "type": "post",
    "url": "api/resourcelocation/",
    "title": "Insert a new ResourceLocation",
    "name": "PostResourceLocation",
    "group": "ResourceLocation",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "JSON",
            "optional": false,
            "field": "body",
            "description": "<p>representation of the ResourceLocation object to insert in JSON format</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "body.EventID",
            "description": "<p>An Event ID for the Event associated with the ResourceLocation</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "body.OrganizationID",
            "description": "<p>An Organization ID for the Organization associated with the ResourceLocation</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "body.ResourceLocationTypeID",
            "description": "<p>The ResourceLocationType ID for the ResourceLocation object.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "body.ResourceLocationStatusID",
            "description": "<p>The ResourceLocationStatus ID for the ResourceLocation object.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "body.Description",
            "description": "<p>Title/Description for the ResourceLocation</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "body.Notes",
            "description": "<p>General Information and notes for the ResourceLocation</p>"
          },
          {
            "group": "Parameter",
            "type": "Float",
            "optional": false,
            "field": "body.LAT",
            "description": "<p>Lattitude coordinate for the location of the ResourceLocation</p>"
          },
          {
            "group": "Parameter",
            "type": "Float",
            "optional": false,
            "field": "body.LONG",
            "description": "<p>Longitude coordinate for the location of the ResourceLocation</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "body.PrimaryPOCName",
            "description": "<p>Primary Point of Contact name for the ResourceLocation</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "body.PrimaryPOCPhone",
            "description": "<p>Primary Point of Contact phone number for the ResourceLocation</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "body.SecondaryPOCName",
            "description": "<p>Secondary Point of Contact name for the ResourceLocation</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "body.SecondaryPOCPhone",
            "description": "<p>Secondary Point of Contact phone number for the ResourceLocation</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "The",
            "description": "<p>ResourceLocation object created from the insert in json format.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "result",
            "description": "<p>Result message.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>Error message.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"result\": \"success\",\n  \"err\": \"\",\n  \"json\": \"<ResourceLocation object>\",\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/resourcelocation.js",
    "groupTitle": "ResourceLocation",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Basic Authorization header with API Key &amp; API Secret.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "401",
            "description": "<p>Unauthorized.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "500",
            "description": "<p>Internal Server Error.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "500.result",
            "description": "<p>error.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "500.err",
            "description": "<p>Error Message.</p>"
          }
        ]
      }
    }
  },
  {
    "type": "put",
    "url": "api/resourcelocation/:id",
    "title": "Update a ResourceLocation",
    "name": "UpdateResourceLocation",
    "group": "ResourceLocation",
    "description": "<p>This will update the Resource Location and will also update any associated ResourceLocationTransport objects to be assocuated with the ResourceLocation.  (Note: if no ResourceLocationTransport objects are included in the update then all current ResourceLocationTransport objects will be removed)</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>The unique ID of the ResourceLocation to update</p>"
          },
          {
            "group": "Parameter",
            "type": "JSON",
            "optional": false,
            "field": "body",
            "description": "<p>representation of the ResourceLocation object along with associated ResourceLocationTransports to update in JSON format</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "json",
            "description": "<p>the number of rows updated.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "result",
            "description": "<p>Result message.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>Error message.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"result\": \"success\",\n    \"err\": \"\",\n    \"json\": {\n      \"rows\": [\n        3\n      ]\n    },\n    \"length\": 1\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/resourcelocation.js",
    "groupTitle": "ResourceLocation",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Basic Authorization header with API Key &amp; API Secret.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "401",
            "description": "<p>Unauthorized.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "500",
            "description": "<p>Internal Server Error.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "500.result",
            "description": "<p>error.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "500.err",
            "description": "<p>Error Message.</p>"
          }
        ]
      }
    }
  },
  {
    "type": "delete",
    "url": "api/resourcerequest/:id",
    "title": "Delete a ResourceRequest",
    "name": "DeleteResourceRequest",
    "group": "ResourceRequest",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>The unique ID of the ResourceRequest to delete</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "json",
            "description": "<p>the number of rows deleted.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "result",
            "description": "<p>Result message.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>Error message.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": " HTTP/1.1 200 OK\n{\n    \"result\": \"success\",\n    \"err\": \"\",\n    \"json\": {\n        \"rows\": 1\n    }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/resourcerequest.js",
    "groupTitle": "ResourceRequest",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Basic Authorization header with API Key &amp; API Secret.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "401",
            "description": "<p>Unauthorized.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "500",
            "description": "<p>Internal Server Error.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "500.result",
            "description": "<p>error.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "500.err",
            "description": "<p>Error Message.</p>"
          }
        ]
      }
    }
  },
  {
    "type": "get",
    "url": "api/resourcerequest/event/:eventID",
    "title": "Get ResourceRequests by Event ID",
    "name": "GetResourceRequestByEventID",
    "group": "ResourceRequest",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "eventID",
            "description": "<p>Event unique ID</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "json",
            "description": "<p>The result data in the form of a json array ResourceRequest objects.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "result",
            "description": "<p>Result message.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>Error message.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/resourcerequest.js",
    "groupTitle": "ResourceRequest",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Basic Authorization header with API Key &amp; API Secret.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "401",
            "description": "<p>Unauthorized.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "500",
            "description": "<p>Internal Server Error.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "500.result",
            "description": "<p>error.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "500.err",
            "description": "<p>Error Message.</p>"
          }
        ]
      }
    }
  },
  {
    "type": "get",
    "url": "api/resourcerequest/:id",
    "title": "Get ResourceRequest by ResourceRequestID",
    "name": "GetResourceRequestByID",
    "group": "ResourceRequest",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>ResourceRequest unique ID</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "json",
            "description": "<p>The result data in the form of a json ResourceRequest object.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "result",
            "description": "<p>Result message.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>Error message.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/resourcerequest.js",
    "groupTitle": "ResourceRequest",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Basic Authorization header with API Key &amp; API Secret.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "401",
            "description": "<p>Unauthorized.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "500",
            "description": "<p>Internal Server Error.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "500.result",
            "description": "<p>error.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "500.err",
            "description": "<p>Error Message.</p>"
          }
        ]
      }
    }
  },
  {
    "type": "get",
    "url": "api/resourcerequest",
    "title": "Get all ResourceRequests",
    "name": "GetResourceRequests",
    "group": "ResourceRequest",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "json",
            "description": "<p>The Result data in the form of a json array of ResourceRequest objects.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "json.RequestResourceID",
            "description": "<p>The RequestResource ID for the ResourceRequest object.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "json.EventID",
            "description": "<p>An Event ID for the Event associated with the ResourceRequest</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "json.RequestStateID",
            "description": "<p>An RequestState ID for the RequestState to be used</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "json.OrganizationID",
            "description": "<p>An Organization ID for the Organization to be used</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "json.Quantity",
            "description": "<p>Number of resources needed</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "json.ResourceTypeID",
            "description": "<p>An ResourceType ID for the ResourceType to be used</p>"
          },
          {
            "group": "Success 200",
            "type": "Float",
            "optional": false,
            "field": "json.LAT",
            "description": "<p>Lattitude coordinate for the location of the ResourceRequest</p>"
          },
          {
            "group": "Success 200",
            "type": "Float",
            "optional": false,
            "field": "json.LONG",
            "description": "<p>Longitude coordinate for the location of the ResourceRequest</p>"
          },
          {
            "group": "Success 200",
            "type": "Decimal",
            "optional": false,
            "field": "json.AreaSize",
            "description": "<p>The area size for the ResourceRequest</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "json.RequestUrgencyID",
            "description": "<p>A ResourceUrgency ID for the ResourceUrgency to be used</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "json.UnitOfMeasure",
            "description": "<p>for the AreaSize</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "json.RequestorName",
            "description": "<p>Individual who is creating the request</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "json.RequestorPhone",
            "description": "<p>Contact phone number for who is creating the request</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "json.RequestorEmail",
            "description": "<p>Email address for who is creating the request</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "json.RequestorUpdatePref",
            "description": "<p>indicates if Requestor would like to be updated on request status</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "json.CreateDate",
            "description": "<p>Date the ResourceRequest was created.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "json.Event",
            "description": "<p>the Event object associated with the ResourceRequest.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "json.RequestState",
            "description": "<p>the RequestState object associated with the ResourceRequest.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "json.ResourceResponses",
            "description": "<p>An Array of ResourceResponses for the ResourceRequest.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "json.RequestUrgency",
            "description": "<p>the RequestUrgency object associated with the ResourceRequest.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "result",
            "description": "<p>Result message.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>Error message.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/resourcerequest.js",
    "groupTitle": "ResourceRequest",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Basic Authorization header with API Key &amp; API Secret.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "401",
            "description": "<p>Unauthorized.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "500",
            "description": "<p>Internal Server Error.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "500.result",
            "description": "<p>error.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "500.err",
            "description": "<p>Error Message.</p>"
          }
        ]
      }
    }
  },
  {
    "type": "post",
    "url": "api/resourcerequest/",
    "title": "Insert a new ResourceRequest",
    "name": "PostResourceRequest",
    "group": "ResourceRequest",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "JSON",
            "optional": false,
            "field": "body",
            "description": "<p>representation of the ResourceRequest object to insert in JSON format</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "body.EventID",
            "description": "<p>An Event ID for the Event associated with the ResourceRequest</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "body.RequestStateID",
            "description": "<p>An RequestState ID for the RequestState to be used</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "body.OrganizationID",
            "description": "<p>An Organization ID for the Organization to be used</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "body.Quantity",
            "description": "<p>Number of resources needed</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "body.ResourceTypeID",
            "description": "<p>An ResourceType ID for the ResourceType to be used</p>"
          },
          {
            "group": "Parameter",
            "type": "Float",
            "optional": false,
            "field": "body.LAT",
            "description": "<p>Lattitude coordinate for the location of the ResourceRequest</p>"
          },
          {
            "group": "Parameter",
            "type": "Float",
            "optional": false,
            "field": "body.LONG",
            "description": "<p>Longitude coordinate for the location of the ResourceRequest</p>"
          },
          {
            "group": "Parameter",
            "type": "Decimal",
            "optional": false,
            "field": "body.AreaSize",
            "description": "<p>The area size for the ResourceRequest</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "body.RequestUrgencyID",
            "description": "<p>A ResourceUrgency ID for the ResourceUrgency to be used</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "body.UnitOfMeasure",
            "description": "<p>for the AreaSize</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "body.RequestorName",
            "description": "<p>Individual who is creating the request</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "body.RequestorPhone",
            "description": "<p>Contact phone number for who is creating the request</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "body.RequestorEmail",
            "description": "<p>Email address for who is creating the request</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "body.RequestorUpdatePref",
            "description": "<p>indicates if Requestor would like to be updated on request status</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "json",
            "description": "<p>The ResourceRequest object created from the insert.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "result",
            "description": "<p>Result message.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>Error message.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"result\": \"success\",\n  \"err\": \"\",\n  \"json\": \"<ResourceRequest object>\",\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/resourcerequest.js",
    "groupTitle": "ResourceRequest",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Basic Authorization header with API Key &amp; API Secret.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "401",
            "description": "<p>Unauthorized.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "500",
            "description": "<p>Internal Server Error.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "500.result",
            "description": "<p>error.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "500.err",
            "description": "<p>Error Message.</p>"
          }
        ]
      }
    }
  },
  {
    "type": "put",
    "url": "api/resourcerequest/:id",
    "title": "Update a ResourceRequest",
    "name": "UpdateResourceRequest",
    "group": "ResourceRequest",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>The unique ID of the ResourceRequest to update</p>"
          },
          {
            "group": "Parameter",
            "type": "JSON",
            "optional": false,
            "field": "body",
            "description": "<p>representation of the ResourceRequest object to update in JSON format</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "json",
            "description": "<p>the number of rows updated.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "result",
            "description": "<p>Result message.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>Error message.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"result\": \"success\",\n    \"err\": \"\",\n    \"json\": {\n      \"rows\": [\n        1\n      ]\n    },\n    \"length\": 1\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/resourcerequest.js",
    "groupTitle": "ResourceRequest",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Basic Authorization header with API Key &amp; API Secret.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "401",
            "description": "<p>Unauthorized.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "500",
            "description": "<p>Internal Server Error.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "500.result",
            "description": "<p>error.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "500.err",
            "description": "<p>Error Message.</p>"
          }
        ]
      }
    }
  }
] });
