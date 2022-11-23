document.getElementById('input-file').addEventListener('change', getFile);

function getFile(event) {
    const input = event.target
    if ('files' in input && input.files.length > 0) {
        processFile(input.files[0]);
    }
    event.target.value = '';
}

function processFile(file) {
    readFileContent(file).then(content => {
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
        let curSec = 0;
        let NBTdata = getBlockOpener(nbt_name);
        let NPCCount = Math.ceil(commands.length / commands_per_npc);
        for (var i = 0; i < commands.length; i += commands_per_npc) {
            curSec++;
            let NPCCommandList = commands.slice(i, i + commands_per_npc);
            let nextNPC = (curSec === NPCCount ? 1 : curSec + 1);
  
            // Need to add special commands per NPC
            NPCCommandList.unshift(`/tickingarea add ~ ~ ~ 4 NPCCOMMANDS`);
            NPCCommandList.push(`/tickingarea remove NPCCOMMANDS`);
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

function readFileContent(file) {
	const reader = new FileReader();
    return new Promise((resolve, reject) => {
        reader.onload = event => resolve(event.target.result);
        reader.onerror = error => reject(error);
        reader.readAsText(file);
    })
}

function getUsefulCommands(content) {
    return content.split('\n').map(x => x.replace(/^\//, "").trim()).filter(x => {
        return x.search("setblock") === 0 || x.search("fill") === 0 || x.search("summon") === 0;
    });
}

function getBlockOpener(nbt_name) {
    return `{Block:{name:"minecraft:beehive",states:{direction:0,honey_level:0},version:17959425},Count:1b,Damage:0s,Name:"minecraft:beehive",Slot:13b,WasPickedUp:0b,tag:{display:{Lore:["Â§gÂ§lCreated using the Nifty Building Tool by Brutus314 and Clawsky123."],Name:"Â§gÂ§l${nbt_name}"},Occupants:[`;
  }
  
function getBlockCloser() {
    return ']}}';
}

function getNPCOpener(section, nbt_name) {
    return `{ActorIdentifier:"minecraft:npc<>",SaveData:{Persistent:1b,Variant:18,CustomName:"${nbt_name}",CustomNameVisible:1b,Tags:["${nbt_name}${section}","NiftyBuildingTool"],Actions:"[{"button_name" : "Build Section ${section}","data" : [`;
}

function getNPCCloser() {
    return `],"mode" : 0,"text" : "","type" : 1}]",InterativeText:"Â§gÂ§lCreated using the Nifty Building Tool by Brutus314 and Clawsky123."},TicksLeftToStay:0}`;
}

function commandToNBT(command) {
    return JSON.stringify({
        cmd_line : command, 
        cmd_ver : 12
    });
}

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
}