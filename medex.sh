#!/usr/bin/env bash

# ------------------------------------------------------------
# Commands references
# ------------------------------------------------------------
# Name	    Alias	Description
# init	    -i	    Create or update your medusa project 
#                   configuration in order to gives you a 
#                   working api using the medusa-extender.
# migrate	m	    Migrate the migrations that has not been 
#                   applied yet. Can also show you the 
#                   migrations already applied and to be applied.
# generate	g	    Generate a new component among: module, 
#                   service, entity, repository, migration, 
#                   validator, router, middleware
# ------------------------------------------------------------
# Usage
# ------------------------------------------------------------
# ./node_modules/.bin/medex g [option]
# ./node_modules/.bin/medex m [option]
# ------------------------------------------------------------
# Options
# Name	        Alias	Description
# ------------------------------------------------------------
# <name>		        Component name to generate
# --module	     -m	    Generate a new module.
# --middleware	 -mi    Generate a new middleware.
# --service	     -s	    Generate a new service.
# --router	     -r	    Generate a new router.
# --entity	     -e	    Generate a new entity.
# --repository   -re    Generate a new repository.
# --migration    -mi    Generate a new migration.
# --validator    -va    Generate a new validator.
# --path <path>  -p	    specify the path where the component
#                       must be generated (by default the 
#                       component will be generated at 
#                       [src/modules/<name>/<name>.<type>.ts].
# ------------------------------------------------------------
# Examples
# ------------------------------------------------------------
# Lets run the following command
#
# ./node_modules/.bin/medex g -m myModule
# ------------------------------------------------------------
# This command will generate a new myModule component. 
# Without specifying the path (-p) where to generate the 
# component, the cli will automatically create the directory 
# myModule under src. The result will be the generation of the 
# module component at src/modules/myModule/myModule.module.ts.
# ------------------------------------------------------------
# Command migrate reference
#
# Usage
# ------------------------------------------------------------
# ./node_modules/.bin/medex m [option]


function medex_generate {
    ./node_modules/.bin/medex g $1
}

function medex_migrate {
    ./node_modules/.bin/medex m $1
}
