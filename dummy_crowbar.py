#!/usr/bin/env python
import os
import sys
import json
import cherrypy
import argparse
from getkey import getkey, keys

parser = argparse.ArgumentParser(description='Dummy Crowbar backend service')
parser.add_argument('scenariodir', help='path to directory with recorded backend responses')
args = parser.parse_args()

basedir = os.path.dirname(os.path.realpath(__file__))
scenariodir = os.path.join(basedir, args.scenariodir)

conf = {
  '/': {
    'tools.trailing_slash.on': False,
    'tools.staticdir.root': os.path.join(basedir, 'public'),
  },
  '/upgrade': {
    'tools.staticdir.on': True,
    'tools.staticdir.dir': '',
    'tools.staticdir.index': 'index.html',
  },
  '/css': {
    'tools.staticdir.on': True,
    'tools.staticdir.dir': 'css',
  },
  '/fonts': {
    'tools.staticdir.on': True,
    'tools.staticdir.dir': 'fonts',
  },
}


def get_states():
    return sorted([f for f in os.listdir(scenariodir) if f.endswith('.json')])


state = get_states()[0]


def get_status():
    status = {}
    with open(os.path.join(scenariodir, state)) as f:
        status = json.load(f)
    return json.dumps(status, indent=4, sort_keys=False)


class Prechecks(object):
    @cherrypy.expose
    def index(self):
        cherrypy.response.status = 501
        return json.dumps({"errors": {"not_implemented": {"data": "not implemented"}}})


class Nodes(object):
    @cherrypy.expose
    def index(self):
        # TODO: maybe respond to POST with something?
        return cherrypy.request.method


class Upgrade(object):
    def __init__(self):
        self.prechecks = Prechecks()
        self.nodes = Nodes()

    @cherrypy.expose
    def index(self, nodes=False):
        if nodes:
            # TODO: return something more reasonable?
            return json.dumps({'upgraded': [], 'not_upgraded': ['node1', 'node2']})
        return get_status()


class Api(object):
    def __init__(self):
        self.upgrade = Upgrade()


class Root(object):
    def __init__(self):
        self.api = Api()


cherrypy.tree.mount(Root(), '/', conf)
cherrypy.engine.start()

while True:
    try:
        print get_status()
        print 'Current state: ' + state
        print 'Press +/- keys to change status response; q to quit; any other key to redisplay current state.'
        k = getkey()
        states = get_states()
        if k == '+':
            state = states[min(states.index(state)+1, len(states)-1)]
        if k == '-':
            state = states[max(0, states.index(state)-1)]
        if k == 'q':
            break
    except KeyboardInterrupt:
        break

cherrypy.engine.exit()
