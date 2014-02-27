Nano Event Publisher
====================
ep.publish(eventName, moduleName, data)
---------------------------------------
Publish named event from given module and passes the data object to event handler parameter object on .data path


**Parameters**

**eventName**:  *string*,  events name

**moduleName**:  *string*,  module name

**data**:  *object*,  data object passed to event handlers on .data path

**Returns**

*object*,  jQuery promise

ep.subscribe(eventName, moduleName, callback)
---------------------------------------------
Subscribes on a given module given event with a callback function. If module name or event name is null all module events or given module every event will trigger the callback respectively


**Parameters**

**eventName**:  *string*,  events name

**moduleName**:  *string*,  modules name

**callback**:  *function*,  event handler function. As parameter it will get an object containing: triggering module name, event name, data, jQuery deferred

ep.unsubscribeAll(eventName, moduleName)
----------------------------------------
Unsubscribes from a given module given event all event handlers


**Parameters**

**eventName**:  *string*,  event name

**moduleName**:  *string*,  module name

ep.unsubscribe(eventName, moduleName, callback)
-----------------------------------------------
Unsubscribes from a given module given event given event handler


**Parameters**

**eventName**:  *string*,  event name

**moduleName**:  *string*,  module name

**callback**:  *function*,  event handler

ep.reset()
----------
Resets own state to initial. Forgets every registered subscriptions. Useful for testing.


