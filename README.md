# HADashboard-widgets
Widgets for HADashboard / Appdaemon
 - Vertical Slider for covers (support all layout sizes)
   
   ![image](https://user-images.githubusercontent.com/61884201/182209692-49c346bf-79c0-4c38-ac6b-3aea8cb69086.png) ![image](https://user-images.githubusercontent.com/61884201/182228606-d72d45a6-6927-44b8-89e1-5df75750d55f.png) ![image](https://user-images.githubusercontent.com/61884201/182228645-69842553-35b8-410a-9922-f9096ffb6c4d.png) ![image](https://user-images.githubusercontent.com/61884201/182228984-1f0af531-c6e3-4bbc-95d3-132da387cc35.png) ![image](https://user-images.githubusercontent.com/61884201/182230473-fe40b6d0-a977-4f02-8a37-2ea2399af5d9.png) ![image](https://user-images.githubusercontent.com/61884201/182230655-1f8ecdc6-4fdc-4fe1-b974-d6a8361da6f0.png)



 
 ## Installation
 Place the file and folder in ```[appdaemon config folder]/custom_widgets/```
 
 ## Configuration:
 
 Example:
 ```yaml
 example_cover:
  widget_type: cover_slider
  title: Example
  entity: cover.example
  look: 1.5
  hideGrass: 0
  openingTrans: "öffnet..."
  closingTrans: "schließt..."
 ```
 
- ```widget_type``` Type of widget. Has to be set to ```cover_slider```
- ```title``` title to be displayed above slider
- ```entity``` cover entity in HA
- ```hideGrass``` whether the grass image behind the cover should be hidden
- ```openingTrans``` text/translation to be shown when the cover is closing. default is "opening"
- ```closingTrans``` text/translation to be shown when the cover is opening. default is "closing"
-  ```look``` how the cover should be displayed:
    - not specified: ![image](https://user-images.githubusercontent.com/61884201/182228525-5de0b22d-d420-42c2-8768-3246266d3785.png) (solid light grey)
    
    - 1: ![image](https://user-images.githubusercontent.com/61884201/182228606-d72d45a6-6927-44b8-89e1-5df75750d55f.png)
    
    - 1.5: ![image](https://user-images.githubusercontent.com/61884201/182228645-69842553-35b8-410a-9922-f9096ffb6c4d.png)
   
    - 2: ![image](https://user-images.githubusercontent.com/61884201/182229425-eab6ac78-2915-4c55-9a5e-c7792d9df87d.png)
    - You can also simply specify a hex color as value. Then the cover is displayed in that solid color
        - e.g. ```look: "#ffa500"```
        
        ![image](https://user-images.githubusercontent.com/61884201/182228984-1f0af531-c6e3-4bbc-95d3-132da387cc35.png)
        
    - You can change the color of the bottom bar with ```bar_color```.

 
