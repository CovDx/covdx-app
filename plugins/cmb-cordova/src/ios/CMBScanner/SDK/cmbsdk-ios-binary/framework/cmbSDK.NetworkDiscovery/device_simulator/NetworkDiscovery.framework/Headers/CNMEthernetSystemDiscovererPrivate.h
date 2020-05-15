//
//  CNMEthernetSystemDiscovererPrivate.h
//  DataManSDK
//
//  Created by Krisztian Gyuris on 20/05/15.
//  Copyright (c) 2015 Cognex. All rights reserved.
//

#import "CNMPacketReceivedDelegate.h"

#define PACKETINFO_IPADDRESS @"ipaddress"

@interface CNMEthernetSystemDiscoverer ()
@property (weak) id<CNMPacketReceivedDelegate> packetReceivedDelegate;

- (void)sendPacket:(CNMCogNamerPacket *)packet toIpAddress:(NSString*)ipAddress;
- (void)sendPacket:(CNMCogNamerPacket *)packet withFullBroadcast:(BOOL)isFullBroadcast;

- (void)sendNetworkConfigurationToMacAddress:(NSData*)macAddress username:(NSString *)username password:(NSString *)password hostName:(NSString *)hostName useDHCP:(BOOL)useDHCP ipAddress:(NSString *)ipAddress subNetMask:(NSString *)subNetMask gateway:(NSString *)gateway dns:(NSString *)dns domainName:(NSString *)domainName fullBroadcast:(BOOL)fullBroadcast;

- (void)sendRestartPacketToIpAddress:(NSString*)ipAddress withMacAddress:(NSData*)macaddress username:(NSString*)username password:(NSString*)password fullBroadcast:(BOOL)fullBroadcast;

@end
