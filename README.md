# Minecraft Bedrock Edition: Nifty Building Tool

The Nifty Building Tool is designed to help turn lists of building-related commands into an easy-to-use AND easy-to-run NBT. By using (usually) only dozens of NPCs as opposed to thousands of minecarts, the results of this file are designed to run smoothly on the common person's computer. Finishing a build using this program will only take a minute, usually less.

<h3>Instructions</h3>
            <ul>
                <li>Aquire a text file containing a list of setblock, summon, and fill commands. The program will only read lines that begin with these commands. A preceeding / does not matter. The program will ignore all other lines</li>
                <li>Specify a name for your output NBT (do not include the ".txt" part). This is partially so you can tell the text files apart on your machine, and affects the name of the NPCs and item. If blank, the in-game name is "Unnamed Build"</li>
                <li>Specify how many commands each NPC should have. More commands means less NPCs, but also run the risk of overloading the NPC and causing it to not function. Default is 346, but some builds require this number to be as low as 200</li>
                <li>Upload a text file (or really any file with readable text). You'll automatically download an output text file called "NiftyBuildingTool_{NBT_NAME}.txt"</li>
                <li>Do whatever you're going to do to load the NBT to your world</li>
                <li><b>IMPORTANT: </b>Ensure the time is day, weather is clear, wait for all NPCs to leave the beehive, and DO NOT break the beehive before completing the build</li>
                <li><b>IMPORTANT: </b>Remove all existing NPCs created by this program before using this program
                    <ul>
                        <li><code>/kill @e[tag="NiftyBuildingTool",type=NPC]</code> will remove all NPCs created by this program</li>
                        <li><code>/kill @e[name="{NBT_NAME}",type=NPC]</code> will remove only the NPCs related to a partiuclar build. Obviously, replace {NBT_NAME} with whatever the actual name is</li>
                    </ul>
                </li>
            </ul>
            <h3>Known Limitations</h3>
            <ul>
                <li>Uses a beehive</li>
                <li>Only guaranteed to actually do stuff in a 9x9 square chunk area, centered on the NPCs. Some world prep beforehand can mitigate this issue</li>
                <li>"Atomic" commands are not guaranteed to be run atomically or in the intended order. i.e. The floor a mob would stand on is not guaranteed to exist when the mob is summoned, and liquids may flow unexpectedly</li>
                <li>This page's styling and upload procedures have a collective half hour of effort in it</li>
                <li>There is sometimes some weirdness if you click through the NPC dialogs too fast. Like auto-clicker fast</li>
            </ul>
            <h3>Troubleshooting</h3>
            <ul>
                <li><i>Dialogs do not loop: </i>Likely due to lingering NPCs from another result of this program. Remove any such NPCs</li>
                <li><i>Command button does not appear: </i>NPC has likely been overloaded. Try decreasing the "Commands per NPC"</li>
            </ul>
            <h3>Other information</h3>
            <ul>
                <li><i>Disclaimer: </i>The responsibility for any use or misuse of this program lies with the user, not the creator. You agree by using this program that you take full responsibility for any actions you take with this program's results. The creator trusts the user to be responsible and positive, but recognizes that not all people are deserving of such trust.</li>
                <li><i>Git: </i><a target="_blank" rel="noopener noreferrer" href="https://github.com/Brutus314/MCB_NiftyBuildingTool">Here</a></li>
                <li>The mastermind behind this project is Clawsky123#0059</li>
            </ul>
