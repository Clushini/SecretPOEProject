import pobapi
import dataclasses
import sys
import json
import lxml.etree
import pobapi
from pobapi import constants, stats
from unstdlib.standard.functools_ import memoized_property


def dump(obj):
    if hasattr(obj, '__dict__'): 
        return vars(obj) 
    else:
        return {attr: getattr(obj, attr, None) for attr in obj.__slots__} 

@memoized_property
def monkeypatch(self) -> stats.Stats:
    """Namespace for character stats.
    :return: Character stats.
    :rtype: :class:`~pobapi.stats.Stats`"""
    kwargs = {
        constants.STATS_MAP.get(i.get("stat")): float(i.get("value"))
        for i in self.xml.find("Build").findall("PlayerStat")
        if constants.STATS_MAP.get(i.get("stat")) and i.get("stat") != "SkillDPS"
    }
    return stats.Stats(**kwargs)


pobapi.PathOfBuildingAPI.stats = monkeypatch

url = sys.argv[1]
build = pobapi.from_url(url)
stats = build.stats
skill = build.active_skill
skillGroup = build.active_skill_group
skillGroups = build.skill_groups
keystones = build.keystones 
items = build.items

jsonObj = {}
jsonObj["Stats"] = dump(stats)
jsonObj["ActiveSkill"] = json.dumps(dataclasses.asdict(skill))
jsonObj["ActiveSkillGroup"] = json.dumps(dataclasses.asdict(skillGroup))
jsonObj["Items"] = []
jsonObj["SkillGroups"] = []
jsonObj["Keystones"] = json.dumps(dataclasses.asdict(keystones))

for item in items:
    jsonObj["Items"].append(dataclasses.asdict(item))

for group in skillGroups:
    jsonObj["SkillGroups"].append(json.dumps(dataclasses.asdict(group)))

print(json.dumps(jsonObj))
sys.stdout.flush()