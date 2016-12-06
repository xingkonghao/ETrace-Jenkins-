//
//  URLCache.h
//  SmartCity
//
//  Created by 星空浩818 on 16/6/16.
//  Copyright © 2016年 ohayou. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface URLCache : NSURLCache
{
    NSMutableDictionary *cachedResponses;
    NSMutableDictionary *responsesInfo;
}

@property (nonatomic, retain) NSMutableDictionary *cachedResponses;
@property (nonatomic, retain) NSMutableDictionary *responsesInfo;

- (void)saveInfo;

@end
