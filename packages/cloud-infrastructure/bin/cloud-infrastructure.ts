#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CloudInfrastructureStack } from '../lib/cloud-infrastructure-stack';

// globals 
const REGION : string = 'us-east-1'

// cdk application
const app = new cdk.App();

new CloudInfrastructureStack(app, 'CloudInfrastructureStack', {

    // add aws region to app
    env: {
        region: REGION,
    },

});
