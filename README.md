# Systemless
A Systemless module for Foundry VTT.

This module implements a "System" module for Foundry Virtual Table Top (ref: https://foundryvtt.com/).

As indicated by the name, Systemless is a systemless game system.
It provides a generic character sheet and a limited set of associated functionality with no tie to any rule system.
It's goal is provide a no-frills, get-started-playing-now mechanism for FoundryVTT.
It offers a crude and limited form of customization designed to handle most game systems without assuming or imposing any rules.
For this reason, Systemless has no automation typically associated with other System modules.
There is no game system or rules to emulate or automate, since the Systemless system is not tied to any game system.

The Systemless system contains a large number of ready-for-use game icons and tokens.
These can be found in the graphics folder.

# Attribution
All .png graphics files are downloaded from [game-icons.net](https://game-icons.net).
These files are provided free of charge under the [CC BY 3.0](https://creativecommons.org/licenses/by/3.0) license.
Creator attribution for each graphic is available at game-icons.net.

# Changelog
The latest production version is listed at the top of the table.
Older versions are listed below the top row.
Note that Foundry Virtual Table Top (FVTT) often makes breaking changes between major versions (FVTT v9 -> v10 significantly changed the internal Data Model, for example) that necessitate some type of rework in this code.
Given this, this code is not strictly backward compatible to older versions of FVTT.
That is, a version of this system that has been tested to work on FVTT v9 will (possibly/probably) not work on FVTT v10.
In general, you should use the tagged version of this software compatible with the version of FVTT you are running.

## Major and Minor Versions of Systemless
Major version changes in Systemless do _not_ mean that Systemless itself is undergoing a breaking change.
Systemless will update it's major version when FVTT makes a major revision (going from FVTT v9 -> v10 for example).

Systemless will make minor version changes to add new features to a major version.

Systemless will make patch version changes to address defects or perform chores within a minor version.
Note that versions prior to v1.1.0 did not follow this standard.
See the Changelog table below for the contents of each version change.

## Breaking Changes
Users of this software should expect that should some kind of change be needed to the Systemless system itself that would create an incompatibility with existing world/game data, Systemless will upgrade any existing game worlds automatically using the upgrade mechanisms provided in the FVTT API.
This is a common practice among system developers that regularly make internal, breaking changes to their data models.
For example, it is used regularly by the D&D 5E System Team to ensure existing 5E games are comptible with updates to the underlying game system software.
For the Systemless system, these kinds of upgrades are expected to be infrequent given the nature of the Systemless system.

## Changelog Updates
This Changelog wil be updated with each version change.
This Changelog will be periodically updated to reflect the latest version of FVTT on which the Systemless system has been tested.

| Tagged Version | Foundry Compatibility | Notes |
|----------------|-----------------------|--------------------------|
| v1.5.1         | FVTT v10 Build 291    |  adjust css for quantifiables |
| v1.5.0         | FVTT v10 Build 291    |  add quantifiables to features |
| v1.4.0         | FVTT v10 Build 291    |  add quantifiables       |
| v1.3.0         | FVTT v10 Build 291    |  add new graphics        |
| v1.2.0         | FVTT v10 Build 291    |  stowed/ready inventory  |
| v1.1.0         | FVTT v10 Build 291    |  add Foci to Features    |
| v1.0.6         | FVTT v10 Build 291    |  add new graphics        |
| v1.0.5         | FVTT v10 Build 290    |  add new graphics        |
| v1.0.4         | FVTT v10 Build 290    |  add new graphics        |
| v1.0.3         | FVTT v10 Build 290    |  update system.json      |
| v1.0.2         | FVTT v10 Build 290    |  inventory bug fixes     |
| v1.0.1         | FVTT v10 Build 286    |  inventory bug fixes     |
| v1.0.0         | FVTT v10 Build 286    |  initial release         |