const arma3Guides = [
    { // Infinite Fuel & Ammo
        title: 'Infinite Fuel & Ammo',
        subtitle: 'Snippets',
        icon: 'https://www.justkaarlo.com/res/core/icons/star.png',
        contentType: 'description',
        showTOC: true,
        description: `
            <h2>Ammo</h2>
            <div class="tabs" data-tabs>
                <div class="tab-list">
                    <button class="tab-btn active" data-tab="tab-InfAmo">Infinite Ammo</button>
                    <button class="tab-btn" data-tab="tab-InfAmoRes">Infinite Ammo On Respawn</button>
                </div>

                <div class="tab-pane active" id="tab-InfAmo">
                    <span data-toc="Infinite Ammo"></span>
                    <span class="text-gray" id="small">Choose a vehicle and place it down. Then double-click on it and insert this code into the init field</span>
                    <pre class="sqf-block">this addEventHandler ["Fired",{(_this select 0) setVehicleAmmo 1}]</pre>
                </div>
                <div class="tab-pane" id="tab-InfAmoRes">
                    <span data-toc="Infinite Ammo On Respawn"></span>
                    <span class="text-gray" id="small">Put this in the init field of the vehicle</span>
                    <pre class="sqf-block">this addEventHandler ["Fired",{(_this select 0) setVehicleAmmo 1}]</pre>
                    <span class="text-gray" id="small">And put this in the Expression field of the Vehicle Respawn module:</span>
                    <pre class="sqf-block">params ["_newVehicle","_oldVehicle"]; _newVehicle addEventHandler ["fired", {(_this select 0) setVehicleAmmo 1}];</pre>
                </div>
            </div>
            <hr>
            <h2>Fuel</h2>
            <div class="tabs" data-tabs>
                <div class="tab-list">
                    <button class="tab-btn active" data-tab="tab-InfFul">Infinite Fuel</button>
                    <button class="tab-btn" data-tab="tab-InfFulRes">Infinite Fuel On Respawn</button>
                </div>
                <div class="tab-pane active" id="tab-InfFul">
                    <span data-toc="Infinite Fuel"></span>
                    <span class="text-gray" id="small">Choose a vehicle and place it down. Then double-click on it and insert this code into the init field:</span>
                    <div class="box"> <code>Example 1</code>
                        <pre class="sqf-block">this spawn {while {alive _this} do {uisleep 300; _this setFuel 1}};</pre>
                    </div>
                    <div class="box"> <code>Example 2</code>
                        <pre class="sqf-block">this addEventHandler ["Fuel", {(_this select 0) setFuel 1}];</pre>
                    </div>
                </div>
                <div class="tab-pane" id="tab-InfFulRes"></pre>
                    <span data-toc="Infinite Fuel On Respawn"></span>
                    <div class="box"> <code>Example 1</code>
                        <span class="text-gray" id="small">Put this in the init field of the vehicle</span>
                        <pre class="sqf-block">this spawn {while {alive _this} do {uisleep 300; _this setFuel 1}};</pre>
                        <span class="text-gray" id="small">And put this in the Expression field of the Vehicle Respawn module</span>
                        <pre class="sqf-block">params ["_newVehicle","_oldVehicle"]; _newVehicle spawn {while {alive _this} do {uisleep 300; _this setFuel 1}};</pre>
                    </div>
                    <div class="box"> <code>Example 2</code>
                        <span class="text-gray" id="small">Put this in the init field of the vehicle</span>
                        <pre class="sqf-block">this addEventHandler ["Fuel", {(_this select 0) setFuel 1}];</pre>
                        <span class="text-gray" id="small">And put this in the Expression field of the Vehicle Respawn module</span>
                        <pre class="sqf-block">_newVehicle addEventHandler ["Fuel", {(_this select 0) setFuel 1}];</pre>
                    </div>
                    </div>
                </div>
            </div>
        `,
    },
    { // Disable Stamina For All AI
        title: 'Disable Stamina For All AI',
        subtitle: 'Snippets',
        icon: 'https://www.justkaarlo.com/res/core/icons/star.png',
        contentType: 'description',
        showTOC: true,
        description: `
            <span class="text-gray" id="small">Go to your mission folder go to your <strong>init.sqf</strong> file and add this line in there or just run it in the debug console.</span>
            <pre class="sqf-block">[] spawn { while {true} do { { _x enableStamina false } foreach allunits; sleep 20; }; };</pre>
        `,
    },
    { // ACE
        type: 'section',
        title: 'ACE',
        subtitle: '━━━━━━━'
    },
    { // Adjusting Cargo Space For Vehicle
        title: 'Adjusting Cargo Space',
        subtitle: 'Snippets',
        icon: 'https://www.justkaarlo.com/res/core/icons/star.png',
        contentType: 'description',
        showTOC: true,
        description: `
            <span class="text-gray" id="small">This snippets are used when you are playing as Zeus. First start with placing down a vehicle or aircraft.<br>Double click on the vehicle you just placed down. Then put this code in Execute field,<br>and note that you need to have it on Local Exec</span>
            <pre class="sqf-block">[_this, 100] call ace_cargo_fnc_setSpace</pre>
        `,
    },
    { // ACE ARSENAL
        title: 'ACE Arsenal',
        subtitle: 'Snippets',
        icon: 'https://www.justkaarlo.com/res/core/icons/star.png',
        contentType: 'description',
        showTOC: false,
        description: `
            <div class="tabs" data-tabs>
                <div class="tab-list">
                    <button class="tab-btn active" data-tab="tab-AceArsExp1">Example 1</button>
                    <button class="tab-btn" data-tab="tab-AceArsExp2">Example 2</button>
                    <button class="tab-btn" data-tab="tab-AceArsExp3">Example 3</button>
                </div>
                <div class="tab-pane active" id="tab-AceArsExp1">
                    <span class="text-gray" id="small">Begin by placing an object, such as a <code>B_CargoNet_01_ammo_F</code>, but feel free to use any object you prefer. Now double-click on the object and enter the following code into the init field:</span>
                    <pre class="sqf-block">[this, true] call ace_arsenal_fnc_initBox;</pre>
                </div>
                <div class="tab-pane" id="tab-AceArsExp2">
                    <span class="text-gray" id="small">This one is unique with its special design. Begin by placing an object. Double-click on it to access the init field. Insert the following code</span>
                    <pre class="sqf-block">this addAction [&quot;&lt;t color='#FFFFFF' size='1'&gt;&lt;img image='a3/ui_f/data/logos/a_64_ca.paa'/&gt;&lt;t color='#ffd700' size='1' font='puristaBold'&gt;ACE ARSENAL&lt;/t&gt;&quot;, {[player, player, true] call ace_arsenal_fnc_openBox;}];</pre>
                </div>
                <div class="tab-pane" id="tab-AceArsExp3">
                    <span class="text-gray" id="small">Start by placing down a trigger and put this activation settings</span>
                    <div class="box"> 
                        <strong>Activation</strong>
                        <table>
                            <tr>
                                <td><code>Type</code></td>
                                <td>None</td>
                            </tr>
                            <tr>
                                <td><code>Activation</code></td>
                                <td>Any Player</td>
                            </tr>
                            <tr>
                                <td><code>Activation Type</code></td>
                                <td>Present</td>
                            </tr>
                            <tr>
                                <td><code>Repeatable</code></td>
                                <td><span class="badge">YES</span></td>
                            </tr>
                            <tr>
                                <td><code>Server Only</code></td>
                                <td><span class="badge">NO</span></td>
                            </tr>
                        </table>
                    </div>
                    <span class="text-gray" id="small">Now that you have filled in those settings, navigate to Expression and utilize the following</span>
                    <div class="box"> 
                        <strong>Expression</strong>
                        <table>
                            <tr>
                                <td>
                                    <code>Condition</code>
                                    <pre class="sqf-block">player in thisList</pre>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <code>On Activation</code>
                                    <pre class="sqf-block">thisTrigger setVariable [&quot;_playerAction&quot;, player addAction [&quot;&lt;t color='#FFFFFF' size='1.4'&gt;&lt;img image='a3/ui_f/data/logos/a_64_ca.paa'/&gt;&lt;t color='#ffd700' size='1.4' font='PuristaBold'&gt; ACE Arsenal&lt;/t&gt;&lt;/t&gt;&quot;, {[player, player, true] call ace_arsenal_fnc_openBox;}]];</pre>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <code>On Deactivation</code>
                                    <pre class="sqf-block">player removeAction (thisTrigger getVariable ["_playerAction", -1])</pre>
                                </td>
                            </tr>
                        </table>
                        <span class="text-gray" id="small">Now you've set up a trigger area. When a player enters this area, they will be presented with an action called ACE Arsenal.</span>
                    </div>
                </div>
            </div>
        `,
    },
    { // ANTISTASI
        type: 'section',
        title: 'ANTISTASI',
        subtitle: '━━━━━━━'
    },
    { // Antistasi Wiki
        title: 'Wiki Documentation',
        subtitle: 'Default & Ultimate',
        icon: 'https://www.justkaarlo.com/res/core/icons/wiki.png',
        link: 'https://official-antistasi-community.github.io/A3-Antistasi-Docs/',
        contentType: 'link',
    },
    { // Antistasi Ultimate Website
        title: 'Official Website',
        subtitle: 'Ultimate',
        icon: 'https://www.justkaarlo.com/res/core/icons/link.png',
        link: 'https://antistasiultimate.com/',
        contentType: 'link',
    },
    { // Antistasi Ultimate Commands
        title: 'Console Commands',
        subtitle: 'Default & Ultimate',
        icon: 'https://www.justkaarlo.com/res/core/icons/star.png',
        link: 'https://official-antistasi-community.github.io/A3-Antistasi-Docs/dev_guide/dev/dev_guide_console_commands.html#',
        contentType: 'description',
        showTOC: true,
        description: `
            <img src="https://antistasiultimate.com/images/SiteLogo1.png" alt="Description">
            <h2>Debug Console Commands for Admin</h2>
            <div class="box box-danger">
                Following is an unsorted collection of debug console commands that usually are not or should not be used by admins and players on live servers.
            </div>
            <span data-toc="Preferance(s)"></span>
            <button class="btn-action" onclick="window.open('https://github.com/Antistasi-Ultimate-Community/A3-Antistasi-Ultimate/wiki/Developer-Documentation', '_blank');">Antistasi Ultimate Github</button>
            <button class="btn-action" onclick="window.open('https://official-antistasi-community.github.io/A3-Antistasi-Docs/dev_guide/dev_guide_index.html', '_blank');">Official Antistasi Dev Guide</button>
            <hr>

            <span data-toc="Nearest Marker"></span><div class="box">
                <code>Nearest Marker</code>  <span class="text-gray" id="small">Run as local. Prints nearest marker in a hint on screen.</span>
                <pre class="sqf-block">["Nearest Marker", format ["%1",([markersX, player] call BIS_fnc_nearestPosition)]] call A3A_fnc_customHint;</pre>
            </div>

            <span data-toc="Display Markernames(s)"></span><div class="box">
                <code>Display Markernames</code>  <span class="text-gray" id="small">Run as Local. Changes all markernames to their variable names.</span>
<pre class="sqf-block">
{
    _mrk = format ["Dum%1", _x];
    _mrk setMarkerTextLocal _x;
} forEach (outposts + seaports + airportsX + resourcesX + factories);
</pre>
</div>
            <span data-toc="Start An Attack"></span><div class="box">
                <code>Start An Attack</code> <span class="text-gray" id="small">Run as server. Will start the process of selecting a target for an attack and attacking it for the given side (side can be Invaders or Occupants). This might result in the other side counterattack and take something or four smaller attacks instead of one big attack mission.</span>
<pre class="sqf-block"><pre class="sqf-block">[side] spawn A3A_fnc_rebelAttack;</pre>
</div>
            <span data-toc="Resources & Money"></span><div class="box">
                <code>Resources & Money</code> <span class="text-gray" id="small">Both run as local. First adds a certain amount to your personal money, Second adds HR and Money to the faction. Replace PM, HR, Money with the value you want to add. Negative numbers will subtract.</span>
<pre class="sqf-block">[PM] call A3A_fnc_resourcesPlayer;</pre>

<pre class="sqf-block"><pre class="sqf-block">
// [HR,Money]
[0,0] remoteExec ["A3A_fnc_resourcesFIA",2];</pre>
</div>
        `,
    },
]