#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(BackgroundRemover, NSObject)

RCT_EXTERN_METHOD(removeBackground:(NSString *)uri
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

@end
