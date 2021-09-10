import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import * as s3Deployment from '@aws-cdk/aws-s3-deployment';
import * as cloudFront from '@aws-cdk/aws-cloudfront';
import { CfnOutput } from '@aws-cdk/core';

// create stack
export class CloudInfrastructureStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // create bucket
    const portfolioBucket = new s3.Bucket(this, "Austin-Portfolio-Website-Bucket", {
      publicReadAccess: true,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      websiteIndexDocument: "index.html",
      websiteErrorDocument: "index.html"
    });

    // create bucket deployment resource
    const portfolioDeployment = new s3Deployment.BucketDeployment(this, "deployStaticWebsite", {
      sources: [s3Deployment.Source.asset("../front-end/dist")],
      destinationBucket: portfolioBucket
   });

   // create cloudfront distribution
   const portfolioDistribution = new cloudFront.CloudFrontWebDistribution(this, 'Austin-Portfolio-Website-CloudFront', {
    originConfigs: [
      {
        s3OriginSource: {
          s3BucketSource: portfolioBucket
        },
        behaviors : [ {isDefaultBehavior: true}]
      }
    ],
  });

  // output website URL to stdout
  new CfnOutput(this, "URL", {
    description: "S3 URL:",
    value: portfolioBucket.bucketWebsiteUrl
  });

 // output website edge caching URL to stdout
  new CfnOutput(this, "URL", {
    description: "CloudFront URL:",
    value: portfolioDistribution.distributionDomainName
  });
 }
}
