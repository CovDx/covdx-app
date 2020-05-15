//
//  NetworkDiscovery.h
//  NetworkDiscovery
//
//  Created by Gyula Hatalyak on 2020. 01. 21..
//  Copyright © 2020. Cognex. All rights reserved.
//

#import <Foundation/Foundation.h>

//! Project version number for CogNamer.
FOUNDATION_EXPORT double NetworkDiscoveryVersionNumber;

//! Project version string for CogNamer.
FOUNDATION_EXPORT const unsigned char NetworkDiscoveryVersionString[];

// In this header, you should import all the public headers of your framework using statements like #import <NetworkDiscovery/PublicHeader.h>

#import <NetworkDiscovery/CNMCogNamerDevice.h>
#import <NetworkDiscovery/CNMEthernetSystemDiscoverer.h>
#import <NetworkDiscovery/CNMSystemDiscoveredDelegate.h>
#import <NetworkDiscovery/CNMCogNamerDeviceType.h>

#import <NetworkDiscovery/CNMBootupPacket.h>
#import <NetworkDiscovery/CNMCogNamerNode.h>
#import <NetworkDiscovery/CNMCogNamerPacket.h>
#import <NetworkDiscovery/CNMCogNamerRecord.h>
#import <NetworkDiscovery/CNMCommentsRecord.h>
#import <NetworkDiscovery/CNMEthernetSystemDiscovererPrivate.h>
#import <NetworkDiscovery/CNMFlashPacket.h>
#import <NetworkDiscovery/CNMHelloPacket.h>
#import <NetworkDiscovery/CNMIdentifyPacket.h>
#import <NetworkDiscovery/CNMIPAddressRecord.h>
#import <NetworkDiscovery/CNMIPAssignPacket.h>
#import <NetworkDiscovery/CNMMacAddressRecord.h>
#import <NetworkDiscovery/CNMNetworkSettingsRecord.h>
#import <NetworkDiscovery/CNMPacketReceivedDelegate.h>
#import <NetworkDiscovery/CNMRestartPacket.h>
