// TODO: Make it not do things immediately
document.getElementById('input-file').addEventListener('change', getFile);

// Entry point for choosing a file
function getFile(event) {
    const input = event.target
    if ('files' in input && input.files.length > 0) {
        processFile(input.files[0]);
    }
    event.target.value = '';
}

// Meat-and-potatoes logic
function processFile(file) {
    readFileContent(file).then(content => {
        // Need to get some info about NBT structure
        const commands = getUsefulCommands(content);
        let commands_per_npc = parseInt(document.getElementById('commands-per-npc').value);
        let nbt_name = document.getElementById('nbt-title').value.trim();
        let file_name;
        if (nbt_name === "") {
            file_name = "NiftyBuildingTool_Output.txt";
            nbt_name = "Unnamed Build"
        } else {
            file_name = "NiftyBuildingTool_" + nbt_name + ".txt";
        }
        if (isNaN(commands_per_npc) || commands_per_npc <= 0) {
            commands_per_npc = 346;
        }

        // Time to start creating the NBT text
        let curSec = 0;
        let NBTdata = getBlockOpener(nbt_name);
        let NPCCount = Math.ceil(commands.length / commands_per_npc);

        // Split the commands into an amount per NPC, and loop over those sections
        for (var i = 0; i < commands.length; i += commands_per_npc) {
            curSec++;
            let NPCCommandList = commands.slice(i, i + commands_per_npc);
            let nextNPC = (curSec === NPCCount ? 1 : curSec + 1);
  
            // Need to add special commands per NPC
            NPCCommandList.unshift(`/tickingarea add circle ~ ~ ~ 4 NIFTYBUILDINGTOOL`);
            NPCCommandList.push(`/tickingarea remove NIFTYBUILDINGTOOL`);
            if (NPCCount > 1) {
                NPCCommandList.push(`/dialogue open @e[tag="${nbt_name}${nextNPC}",type=NPC] @initiator`);
            }
            NPCCommandList.push(`/kill @s`);
  
            // Build meat and potatoes of the NPC
            NBTdata += getNPCOpener(curSec, nbt_name);
            NBTdata += NPCCommandList.map(x => commandToNBT(x.trim())).join(",");
            NBTdata += getNPCCloser();
  
            // If there will be another NPC, glue with comma
            if (curSec < NPCCount) {
              NBTdata += ",";
            }
        }
        NBTdata += getBlockCloser();
        download(file_name, NBTdata);
    }).catch(error => console.log(error));
}

// Read a whole file
function readFileContent(file) {
	const reader = new FileReader();
    return new Promise((resolve, reject) => {
        reader.onload = event => resolve(event.target.result);
        reader.onerror = error => reject(error);
        reader.readAsText(file);
    })
}

// Find a line that begins with setblock, fill, or summon and ignore whitespace and /
function getUsefulCommands(content) {
    return content.split('\n').map(x => x.replace(/^\//, "").trim()).filter(x => {
        return x.search("setblock") === 0 || x.search("fill") === 0 || x.search("summon") === 0;
    });
}

// Block functions need run one time, put NPCs between
function getBlockOpener(nbt_name) {
    return `{Block:{name:"minecraft:moving_block",states:{},version:17959425},Count:1b,Damage:0s,Name:"minecraft:moving_block",WasPickedUp:0b,tag:{display:{Lore:["Created using the Nifty Building Tool\nBy Brutus314 and Clawsky123."],Name:"Â§gÂ§l${nbt_name}"},movingBlock:{name:"minecraft:sea_lantern",states:{},version:17879555},movingEntity:{Occupants:[`;
}
  
function getBlockCloser() {
    return '],id:"Beehive"}}}';
}

// NPC commands need run once per NPC, put that NPC's commands between them
function getNPCOpener(section, nbt_name) {
    return `{ActorIdentifier:"minecraft:npc<>",SaveData:{Persistent:1b,Pos:[],Variant:18,definitions:["+minecraft:npc"],RawtextName:"${nbt_name}",CustomName:"${nbt_name}",CustomNameVisible:1b,Tags:["${nbt_name}${section}","NiftyBuildingTool"],Actions:"[{"button_name" : "Build Section ${section}","data" : [`;
}

function getNPCCloser() {
    return `],"mode" : 0,"text" : "","type" : 1}]",InterativeText:"Â§4Â§lCreated using the Nifty Building Tool by Brutus314 and Clawsky123."},TicksLeftToStay:0}`;
}

// Commands are written in JSON in the NBT
function commandToNBT(command) {
    return JSON.stringify({
        cmd_line : command, 
        cmd_ver : 12
    });
}

// Just a function that downloads a file containing the passed in text
function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
}