//
//  AppDelegate.m
//  SmartCity
//
//  Created by  on 16/5/16.
//  Copyright © 2016年 ohayou. All rights reserved.
//

#import "AppDelegate.h"
//#import <BaiduMapAPI_Base/BMKMapManager.h>
#import <UMMobClick/MobClick.h>
//#import <JSPatch/JSPatch.h>

#define BaiduKey @"3KnD9ZmoBquhtkVguRM5xy53QGn4k7I4"
#define UMKEK @"5742c49c67e58ed0d100241c"
@interface AppDelegate ()
{
    BMKMapManager *_mapManager;
    NSInteger temp;
}
@property (nonatomic,assign)BOOL hasInit;

@end

@implementation AppDelegate


- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {

    _hasInit = YES;
    [self setBaiduSDK];
    [[UIApplication sharedApplication] setStatusBarStyle:UIStatusBarStyleLightContent];
//    [[UIApplication sharedApplication] setStatusBarStyle:UIStatusBarStyleLightContent animated:YES];
//    [self setUMMobClick];
    return YES;
}

- (void)setBaiduSDK
{
    _mapManager = [[BMKMapManager alloc]init];
    BOOL ret = [_mapManager start:BaiduKey generalDelegate:self];
    if (!ret) {
        NSLog(@"baidumap start failed!");
    }
}

- (BOOL)application:(UIApplication *)application handleOpenURL:(NSURL *)url
{
    NSLog(@"%@",url);
    return YES;
}
- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(NSString *)sourceApplication annotation:(id)annotation
{

//    NSString *urlStr = url.absoluteString;
//    if (urlStr!=nil) {
//        NSLog(@"%@",url.absoluteString);
//        NSArray *tempArr = [urlStr componentsSeparatedByString:@"SmartCity://code:"];
//
//        [[NSNotificationCenter defaultCenter]postNotificationName:@"Code" object:nil userInfo:@{@"code":tempArr.lastObject}];
//        return YES;
//    
//    }
 
    return YES;
}
- (void)setUMMobClick
{
    [MobClick setLogEnabled:YES];
    [UMAnalyticsConfig sharedInstance].appKey = @"5742c49c67e58ed0d100241c";
    [UMAnalyticsConfig sharedInstance].secret = nil;
    [MobClick startWithConfigure:[UMAnalyticsConfig sharedInstance]];
}
- (void)applicationWillResignActive:(UIApplication *)application {
    // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
    // Use this method to pause ongoing tasks, disable timers, and throttle down OpenGL ES frame rates. Games should use this method to pause the game.
}

- (void)applicationDidEnterBackground:(UIApplication *)application {
    temp = 0;
    // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
    // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
}

- (void)applicationWillEnterForeground:(UIApplication *)application {
    // Called as part of the transition from the background to the inactive state; here you can undo many of the changes made on entering the background.
}

- (void)applicationDidBecomeActive:(UIApplication *)application {
    // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
}

- (void)applicationWillTerminate:(UIApplication *)application {
    // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
}

@end
