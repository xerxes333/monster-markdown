/**
 * TODO: I'm sure there is a more elegant way to do this but
 * this is where I am right now so ¯\_(ツ)_/¯
 */
import _each from "lodash/each";
import _find from "lodash/find";
import _join from "lodash/join";
import _upperFirst from "lodash/upperFirst";

const line = `___`;
const saves = [
  "strength_save",
  "dexterity_save",
  "constitution_save",
  "intelligence_save",
  "wisdom_save",
  "charisma_save",
];
const crTable = [
  { cr: "1/8", xp: 25 },
  { cr: "1/4", xp: 50 },
  { cr: "1/2", xp: 100 },
  { cr: "1", xp: 200 },
  { cr: "2", xp: 450 },
  { cr: "3", xp: 700 },
  { cr: "4", xp: 1100 },
  { cr: "5", xp: 1800 },
  { cr: "6", xp: 2300 },
  { cr: "7", xp: 2900 },
  { cr: "8", xp: 3900 },
  { cr: "9", xp: 5000 },
  { cr: "10", xp: 5900 },
  { cr: "11", xp: 7200 },
  { cr: "12", xp: 8400 },
  { cr: "14", xp: 11500 },
  { cr: "13", xp: 10000 },
  { cr: "15", xp: 13000 },
  { cr: "16", xp: 15000 },
  { cr: "17", xp: 18000 },
  { cr: "18", xp: 20000 },
  { cr: "19", xp: 22000 },
  { cr: "20", xp: 25000 },
  { cr: "21", xp: 33000 },
  { cr: "22", xp: 41000 },
  { cr: "23", xp: 50000 },
  { cr: "24", xp: 62000 },
  { cr: "25", xp: 75000 },
  { cr: "26", xp: 90000 },
  { cr: "27", xp: 105000 },
  { cr: "28", xp: 120000 },
  { cr: "29", xp: 135000 },
  { cr: "30", xp: 155000 },
];

/**
 * Prefix the + sign for positive
 * @param {number} num
 * @return {(string|number)}
 */
const sign = (num) => {
  return 0 < num ? `+${num}` : num;
};

/**
 * Calculates ability modifiers for ability scores
 * @param {number} ability
 * @return {string}
 */
const abilityMod = (ability) => {
  const num = Math.floor((ability - 10) / 2);
  return sign(num);
};

/**
 * Searches entire result object for all saving throws
 * and parses them in short format then filters all null records.
 * @param {object} obj
 * @return {string} Returns comma separated string of all saving throws
 */
const savingThrows = (obj) => {
  const list = saves
    .map((save) => {
      return obj[save]
        ? save.substr(0, 3).toUpperCase() + " " + sign(obj[save])
        : null;
    })
    .filter((s) => s);

  return _join(list, ", ");
};

/**
 * Parses skills found in the child skills object.
 * @param {Object.<string>} skills
 * @return {string} Returns comma separated string of all skills
 */
const skills = (skills) => {
  let list = [];
  _each(skills, (val, key) => {
    list.push(`${_upperFirst(key)} ${sign(val)}`);
  });
  return _join(list, ", ");
};

/**
 * Parse special abilities
 * @param {Array.<Object>.<string>} abilities
 * @return {string} Returns custom markdown formatted string
 */
const specialAbilities = (abilities) => {
  const regex = /\n\n|\n/gi;
  const regex2 = /\*/gi;
  const list = abilities.map((ability) => {
    return `***${ability.name}.*** ${ability.desc
      .replace(regex, "\n>\n>")
      .replace(regex2, "\\*")}`;
  });
  return doubleSpace(list);
};

/**
 * Parse actions
 * @param {*} actions
 * @return {string} Returns custom markdown formatted string
 */
const actions = (actions) => {
  const list = actions.map((action) => {
    const regex = /((melee)|(ranged)).*(weapon attack:)/gi;

    return `***${action.name}.*** ${action.desc.replace(regex, "*$&*")}`;
  });
  return doubleSpace(list);
};

/**
 * Double space
 * @param {Array.<string>} list
 */
const doubleSpace = (list) => {
  let newList = [];

  list.forEach((v, i) => {
    if (i > 0) {
      newList.push("");
    }
    newList.push(v);
  });

  return newList;
};

/**
 * Combines all the markdown parsed sections the final text
 * @param {Object.<string>} data
 * @return {string} Returns markdown text string from response object
 */
const mash = (data) => {
  let txt = [];

  txt.push(line);
  txt.push(line);
  txt.push(`## ${data.name}`);
  txt.push(`*${data.size}, ${data.alignment}*`);

  txt.push(line);
  txt.push(`- **Armor Class** ${data.armor_class} (${data.armor_desc})`);
  txt.push(`- **Hit Points** ${data.hit_points}`);

  const speed =
    `- **Speed** ${data.speed.walk}ft.` +
    (data.speed.fly ? `, fly ${data.speed.fly}ft.` : "") +
    (data.speed.swim ? `, swim ${data.speed.swim}ft.` : "");
  txt.push(speed);

  txt.push(line);
  txt.push(`|  STR  |  DEX  |  CON  |  INT  |  WIS  |  CHA  |`);
  txt.push(`|:-----:|:-----:|:-----:|:-----:|:-----:|:-----:|`);
  txt.push(
    `|${data.strength} (${abilityMod(data.strength)})|` +
      `${data.dexterity} (${abilityMod(data.dexterity)})|` +
      `${data.constitution} (${abilityMod(data.constitution)})|` +
      `${data.intelligence} (${abilityMod(data.intelligence)})|` +
      `${data.wisdom} (${abilityMod(data.wisdom)})|` +
      `${data.charisma} (${abilityMod(data.charisma)})|`
  );

  txt.push(line);
  const saving = savingThrows(data);
  if (saving) txt.push(`- **Saving Throws** ${saving}`);
  txt.push(`- **Skills** ${skills(data.skills)}`);

  if (data.damage_immunities)
    txt.push(`- **Damage Immunities** ${data.damage_immunities}`);
  if (data.condition_immunities)
    txt.push(`- **Condition Immunities** ${data.condition_immunities}`);
  txt.push(`- **Senses** ${data.senses}`);
  txt.push(`- **Languages** ${data.languages}`);

  const xp = _find(crTable, ["cr", data.challenge_rating]).xp;
  txt.push(`- **Challenge** ${data.challenge_rating} (${xp}xp)`);

  txt.push(line);

  if (data.special_abilities) {
    // txt.push(`### Special Abilities`);
    txt = txt.concat(specialAbilities(data.special_abilities));
  }

  if (data.actions) {
    txt.push(`### Actions`);
    txt = txt.concat(actions(data.actions));
  }

  const output = _join(
    txt.map((ln, i) => {
      if (i <= 1) return ln;
      return `>${ln}`;
    }),
    "\n"
  );

  return output;
};

export { mash };
