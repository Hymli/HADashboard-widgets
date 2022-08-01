function base_cover_slider(widget_id, url, skin, parameters) {

    if (widgets === undefined) {
        var widgets = {}
    }

    widgets[widget_id] = this;

    ////////// Initialization ////////

    widgets[widget_id].widget_id = widget_id;

    // show grass?
    if (parameters.hideGrass) { document.getElementById(widget_id).querySelector(".coverslider-container").style = "background: none" }
    // move background to random percentage on x-axis
    document.getElementById(widget_id).querySelector(".coverslider-container").style.backgroundPosition = parseInt(Math.random() * 100) + "% 100%"

    // create look of blinds
    if (parameters.look == 1) { // Roller shutter look
        document.getElementById(widget_id).querySelector(".cover-slider").style = "background-image: repeating-linear-gradient(0deg, #ffffff, #ffffff59 4px, #737373 1px, #737373);"
    } else if (parameters.look == 1.5) { // Roller shutter alternative
        document.getElementById(widget_id).querySelector(".cover-slider").style = "background-image: repeating-linear-gradient(0deg, #ffffff, #1c1c1c 6px, #999999 1px, #737373);"
    } else if (parameters.look == 2) { // pleated blinds look
        document.getElementById(widget_id).querySelector(".cover-slider").style = "background-image: repeating-linear-gradient(0deg, #ffffff, #ffffff59 7px, #73737300 1px, #737373); background-color: #3a3a3a;"
    } else if (parameters.look.startsWith("#")) { // hex color
        document.getElementById(widget_id).querySelector(".cover-slider").style = "background-color: " + parameters.look
    }

    document.getElementById(widget_id).querySelector(".cover-slider").style.borderBottom = "15px solid " + parameters.bar_color


    // Parameters may come in useful later on
    widgets[widget_id].parameters = parameters;


    ////////// Parameter handling ////////

    if ("monitored_entity" in widgets[widget_id].parameters) {
        entity = widgets[widget_id].parameters.monitored_entity;
    } else {
        entity = widgets[widget_id].parameters.entity;
    }


    // Initial will be called when the dashboard loads and state has been gathered for the entity
    // Update will be called every time an update occurs for that entity

    widgets[widget_id].OnStateAvailable = OnStateAvailable;
    widgets[widget_id].OnStateUpdate = OnStateUpdate;

    if ("entity" in parameters) {
        var monitored_entities = [{
            entity: parameters.entity,
            initial: widgets[widget_id].OnStateAvailable,
            update: widgets[widget_id].OnStateUpdate,
        }, ];
    } else {
        var monitored_entities = [];
    }

    // Finally, call the parent constructor to get things moving

    WidgetBase.call(
        widgets[widget_id],
        widget_id,
        url,
        skin,
        parameters,
        monitored_entities, //
        [] // no Callbacks
    );

    ////////// Handling for clicking/dragging in slider //////////

    var mouseDown = 0;
    var tempPos = 0;

    // When mouse gets clicked
    document.getElementById(widget_id).querySelector(".coverslider-container").onmousedown = (e) => {
        tempPos = 100 - // because 90% height means 10% opened
            (Math.round(
                (e.layerY / document.getElementById(widget_id).querySelector(".coverslider-container").offsetHeight) * 100 // Percentage of height
                /
                5) * 5) // Round to steps of 5
        set_slider_pos(tempPos)
        postPosition(widgets[widget_id], tempPos)
            ++mouseDown; //store that mouse is clicked
    };

    // When mouse is dragged
    document.getElementById(widget_id).querySelector(".coverslider-container").onmousemove = (e) => {
        if (mouseDown) { // Only if pressed
            tempPos = 100 - (Math.round(
                    (e.layerY / document.getElementById(widget_id).querySelector(".coverslider-container").offsetHeight) * 100 // Percentage of height
                    /
                    2) * 2) // Round to steps of 2
            set_slider_pos(tempPos)
            postPosition(widgets[widget_id], tempPos)
        }
    };

    // When mouse is'nt clicked anymore
    document
        .getElementById(widget_id)
        .querySelector(".coverslider-container").onmouseup = (e) => {
            mouseDown = 0; // store.
        };


    ////////// Function Definitions ////////

    // The StateAvailable function will be called when
    // covWidg.state[<entity>] has valid information for the requested entity
    // state is the initial state
    // Methods

    function OnStateAvailable(covWidg, state) {
        covWidg.state = state.state;
        covWidg.minvalue = 0;
        covWidg.maxvalue = 100;
        if ("step" in covWidg.parameters) {
            covWidg.stepvalue = covWidg.parameters.step / 100;
        } else {
            covWidg.stepvalue = 1;
        }

        if ("current_position" in state.attributes) {
            covWidg.current_position = state.attributes.current_position;
        } else {
            covWidg.current_position = 0;
        }
        set_view(covWidg, covWidg.state, covWidg.current_position);
    }

    function OnStateUpdate(covWidg, state) {
        covWidg.state = state.state;
        if ("current_position" in state.attributes) {
            covWidg.current_position = state.attributes.current_position;
        } else {
            covWidg.current_position = 0;
        }

        set_view(covWidg, covWidg.state, covWidg.current_position);
    }

    // Send new position to HA
    function postPosition(covWidg, position) {
        console.log(covWidg.parameters)
        console.log(args)
        if (covWidg.current_position != position) {
            covWidg.current_position = position;
            var args = covWidg.parameters.post_service_position;
            args["position"] = position;
            covWidg.call_service(covWidg, args);
        }
    }

    function set_view(covWidg, state, position) {
        if (typeof position == "undefined") {
            covWidg.set_field(covWidg, "Position", 0);
        } else {
            covWidg.set_field(covWidg, "Position", position);
        }

        // Show %age instead of "closed" or "open"
        if (state != "open" && state != "closed") {
            if (state == "opening") {
                covWidg.set_field(covWidg, "State", covWidg.parameters.openingTrans);
            } else if (state == "closing") {
                covWidg.set_field(covWidg, "State", covWidg.parameters.closingTrans);
            } else {
                covWidg.set_field(covWidg, "State", state);
            }
        } else {
            covWidg.set_field(covWidg, "State", position + "%");
        }

        set_slider_pos(covWidg.current_position)
    }

    function set_slider_pos(pos) {
        if (pos <= 5) { pos = 0 } // pos = 0 if initally <= 5 so it's easier to close the cover completely
        if (pos >= 95) { pos = 100 } // pos = 100 if initally >= 95 so it's easier to open the cover completely
        document.getElementById(widget_id)
            .querySelector(".cover-slider").style.height = 100 - pos + "%"; // set height of slider to the opposite of position (100% means fully opened means 0 height)
    }
}
