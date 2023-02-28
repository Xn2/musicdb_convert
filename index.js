const xml2json = require("xml2json");
const iconv = require("iconv-lite");
const fs = require('fs').promises;


async function main(){
    const original = await fs.readFile('./music_db.xml')
    const shift = iconv.decode(original, "Shift_JIS").toString()
    const parsed = JSON.parse(xml2json.toJson(shift).toString())
    const final = {mdb: {music: []}};
    for (music of parsed.mdb.music){
        const obj = {
            "@id" : music.id,
            "info": {
                "title_name": music.info.title_name,
                "version" : {
                    "@__type" : "u8",
                    "#text" : music.info.version.$t
                },
                "inf_ver" : {
                    "@__type" : "u8",
                    "#text" : music.info.inf_ver.$t
                }
            },
            "difficulty": {
                "novice":{
                    "difnum":{
                        "@__type":"u8",
                        "#text" : music.difficulty.novice.difnum.$t
                    }
                },
                "advanced":{
                    "difnum":{
                        "@__type":"u8",
                        "#text" : music.difficulty.advanced.difnum.$t
                    }
                },
                "exhaust":{
                    "difnum":{
                        "@__type":"u8",
                        "#text" : music.difficulty.exhaust.difnum.$t
                    }
                },
                "infinite":{
                    "difnum":{
                        "@__type":"u8",
                        "#text" : music.difficulty.infinite.difnum.$t
                    }
                },
            }
        }
        if (Object.keys(music.difficulty).length === 5){
            obj.difficulty.maximum = {
                "difnum":{
                    "@__type":"u8",
                    "#text" : music.difficulty.maximum.difnum.$t
                }
            } 
        }
        final.mdb.music.push(obj)
    }
    await fs.writeFile('out.json', JSON.stringify(final))
}

main()

