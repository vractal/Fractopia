
# Fractopia: project and ideias

Fractopia is an outline of a new way of relating in the digital age. Not only human, and human-object relations, but also the relations we have with our data.

Fractopia intents to be a layer on top of data. Instead of a platform or app, a layer that uses semantic data to define how you see and interact with linked data (and thus, the world).

This new perspective is possible due to Solid. Solid enables people to take control of their data by storing them in decentralized data stores called Pods. Pods are like secure personal web servers for data. When data is stored in someone's Pod, they control which people and applications can access it.

Our project is deeply connected with Communities and Social Empowerment. However, as the concepts we introduced could be used with any kind of data and tools, and facilitates Solid capabilities as a whole, Fractopia could impact any area that Solid could be used.

Short intro video: https://www.youtube.com/watch?v=wtemMRwScJ4

Live demo: https://proto.fractopia.org
- Some notable bugs
  - When you create a note, you need to refresh the screen to see the update on the list
  - Spaces are getting erased sometimes after adding a second (sorry)



# Tech-stack

The main technologies we used are:

- vue/vuex
- solid-client (inrupt)
- solid-authn-client-browser (inrupt)
- Vuetify - (for Ui components)
- rdf-namespaces

# Important concepts in Fractopia
Here we define some concepts that constitute the basis of Fractopia and you are going to see a lot around here.

- Spaces:
    
    - Spaces are Storages where data of a profile or group is stored at. It also contains access control information.
        
- Portals:
    
    - Portals are the interfaces by which people interact with their data. You look networks of data through your portals. This portals can define what types of data/relations you are interested in, how can you act on this data and even the interface. You can configure and share them, with different tools and components. Basically, everything inside a Portal is a Portal as well, that may contain other Portals. Portals are defined by semantic data stored in pods, so they can easily be shared. Any non-tech oriented person should be able to create new portals to visualize and interact with data (and other people, and the world) in their own way.
        
- HyperFolders (in the search for a better name):
    
    - HyperFolders are collections of links to things and their relations. You can see them as folders, but they are really graphs. Your personal graphs, your mind map to the data you care about. They are not bound to regular folders, as they are links that lead to other links and things. So one thing can be in many hyperfolders, and one hyperfolder can contain data from many spaces.
        
- Dynamic vocabularies and shared ontologies
    
    - One of the main goals of Fractopia is a place where anyone can experience the digital space itself as home. That is, not only feel comfortable in a specific social media or forum, but in to the entire network. And that's possible, because in Fractopia we are the crafters of our own network.
        
    - In order to do that, the user must be able to define their own ontologies as easily as they think them but, at the same time, the more connections, the better.
        
    - To conciliate that, besides being able to define new concepts and relations for data easily, people should be able to discuss and share their ontologies, using a mix of personal, local and global vocabularies for instance. Thus we allow for diversity and localization without giving up on integration.
        

# Roadmap and future goals

- Create personalized types of data, such as recipes, musics, books, events, and ways of interacting with them;
- Use apropriate solid related vocabs correctly (typeIndex, containers, etc)
- 
- Include management tasks, forums, and blogs functionalities;
- Create Libraries and Groups tools: ways of sharing and visualizing any kind of data and relations;
- Try integrations with other Solid-powered technologies that already exists;
- Strategic discussion about how to make Fractopia flourish, with a broader community.

# A Fractopic dream

We'll tell a story, maybe a future one, about Fractopia, and how it could be used. We hope that it gives a better idea of what we can build with Fractopia
ane lives in Manaus, 37, and wanted to learn how to grow her own food. She doesn't know how, but she hears there is a place she can find communities about pretty much anything people do. She decides to try it out. "Fractopia, weird name". Seemed a little confusing at first, but after a while it started to make sense.

She had a space to keep things, and connect things together. She had Portals through which she could see and interact with things. After that, she decided to venture in the social portal. There, she found a big community from Manaus, and through its portals got to know a lot of different parts of the town.

Among them, a group of permacultors, whom happily replied in joining and added her in their space. saw a portal with up to date information like best vegetables to grown that month, projections, curated news (actually, 4 different collections sometimes quite disagreeing), weather reports. In another, people discussed their experiences and learned together in permaculture and non-permaculture related topics. They had a so called collection with information about every plant and animal you could imagine. Some were from their own space, some were shared and linked from all over the globe.

Another was created by a solidary econommy cooperative and made easy to keep track and organize of the local economy. Has been replicating in the whole world..

And none of this people are developers, or even tech oriented. They just had an way to manipulate data and relations in a human way.. like moving boxes around.


# Backlog (non exaustive)

## Tools and functionalities:
- [ ] Editor of data in blocks (dokieli?)
- [ ] Libraries
- [ ] Tasks
- [ ] Forum
- [ ] Blogs
- [ ] Environment for collaboratively creating data models and ontologies.
- [ ] Environment for creating relationships between things
- [ ] Tool for creating and sharing portals Portals usable by non-tech savier people
- [ ] Graph vision of data
- [ ] Data vizualization components ex: gráficos, grafos, tabelas, paineis, mapas...
- [ ] Territories: 2D or 3D coolaborative digital territories for more organic interactions online and ways of spacialy represent linked data 
- [ ] Integration with audio/video calls
- [ ] Integration with Matrix Network
- [ ] Contrutor de layouts compartilhaveis pelo usuario final
- [ ] Forma de integrar componentes externos (webcomponents?)

## General
- [ ] Implement end-to-end encryption
- [ ] Multiple personas, easyli changeable/accessable
- [ ] Show related projects, like OpenSource Ecology
- [ ] Create fractopia ontology
- [ ] Create data migration system
- [ ] Save some or all data from a Pod on a device, for offline mode
- [ ] Offline mode

## Portals
- [ ] Define types and structure for creation and display
- [x] Change and create new ones
- [ ] Custom root portals



# How to run it 

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
