<!--svg xmlns="http://www.w3.org/2000/svg" 
     xmlns:xlink="http://www.w3.org/1999/xlink"
     version="1.1"  width="900px" height="700px" 
>

    <! The cards have a natural width of 169.075 and a height of 244.640. It
         center is located at (+98.0375, +122.320). >
    <! The original back color was #0062ff. The color of the back card can
         be changed by setting the fill on the USE-element. >

    <use xlink:href="templates/svg-cards-indented.svg#back" x="150" y="10" fill="red"/>
    <use xlink:href="templates/svg-cards-indented.svg#1_heart" x="0" y="0"/>
    <use xlink:href="templates/svg-cards-indented.svg#black_joker" x="100" y="100"/>
    <use xlink:href="templates/svg-cards-indented.svg#king_diamond" x="200" y="200" transform="rotate(45,198.0375,122.320)scale(0.5)"/>
</svg-->

<div class="dataContainer">
    <div class="container welcomeText">
        Welcome <span id="usersName"></span>
    </div>
    <div class="gameControls">
        <div class="gameBoxes">
            <button id="logout">Log Out</button>
            <button id="createGame">Create Game</button>
            <button id="joinGame">Join Game</button>
        </div>
    </div>
    <div class="gameControls">
        <div class="container">Game Log</div>
        <div class="gameBoxes logArea">
            
        </div>
    </div>
    <div class="gameControls">
        <div class="container">Chat Area</div>
        <div class="chat gameBoxes">
            Out of service
        </div>
        <input class="gameBoxes" type="text" name="chat" style="width: 90%;margin-left: auto;margin-right: auto;display: block;">
    </div>
</div>

<!-- Game board -->
<svg width="900" height="700" 
     xmlns="http://www.w3.org/2000/svg"
     xmlns:xlink="http://www.w3.org/1999/xlink"
>

    <g>
        <title>background</title>
        <rect fill="#2c682c" id="canvas_background" height="650" width="900" y="-1" x="-1"/>
        <g display="none" overflow="visible" y="0" x="0" height="100%" width="100%" id="canvasGrid">
            <rect fill="url(#gridpattern)" stroke-width="0" y="0" x="0" height="100%" width="100%"/>
        </g>
    </g>
    <rect fill="#fff" stroke="#000" stroke-width="1.5" x="412" y="204" width="85" height="122" id="stock_base" opacity="0.2"/>
    <g id="stock"></g>
    <rect class="dragover" fill="#fff" stroke="#000" stroke-width="1.5" x="289.5" y="210" width="85" height="122" id="west_base" transform="rotate(90, 332, 272)" opacity="0.2"/>
    <g id="west"></g>
    <rect class="dragover" fill="#fff" stroke="#000" stroke-width="1.5" x="525.5" y="210" width="85" height="122" id="east_base" transform="rotate(90, 568, 273)" opacity="0.2"/>
    <g id="east"></g>
    <rect class="dragover" fill="#fff" stroke="#000" stroke-width="1.5" x="412" y="70.64" width="85" height="122" id="north_base" opacity="0.2"/>
    <g id="north"></g>
    <rect class="dragover" fill="#fff" stroke="#000" stroke-width="1.5" x="412" y="335" width="85" height="122" id="south_base" opacity="0.2"/>
    <g id="south"></g>
    <rect class="dragover" fill="#fff" stroke="#000" stroke-width="1.5" x="288" y="91" width="85" height="122" id="northWest_base" transform="rotate(-45, 330, 153)" opacity="0.2"/>
    <g id="northWest"></g>
    <rect class="dragover" fill="#fff" stroke="#000" stroke-width="1.5" x="535" y="85" width="85" height="122" id="northEast_base" transform="rotate(45, 571, 149)" opacity="0.2"/>
    <g id="northEast"></g>
    <rect class="dragover" fill="#fff" stroke="#000" stroke-width="1.5" x="286" y="331" width="85" height="122" id="southWest_base" transform="rotate(45, 334, 395)" opacity="0.2"/>
    <g id="southWest"></g>
    <rect class="dragover" fill="#fff" stroke="#000" stroke-width="1.5" x="528" y="328" width="85" height="122" id="southEast_base" transform="rotate(-45, 576, 389)" opacity="0.2"/>
    <g id="southEast"></g>
    <rect fill="#fff" stroke="#000" stroke-width="1.5" stroke-opacity="null" fill-opacity="null" x="162.5" y="515" width="595" height="122" id="hand_base" opacity="0.2"/>
    <g id="hand"></g>
    <text fill="#000" stroke="#000" stroke-width="0" x="0" y="47" id="oppCards" font-size="14" font-family="Helvetica, Arial, sans-serif" text-anchor="start" xml:space="preserve">
        Opponent's Cards Left:
    </text>
</svg>