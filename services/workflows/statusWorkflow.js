import Finity from 'finity';
import * as notificationService from '../notificationService.js';

export const createPostStateMachine = (post, repository) => {
  return Finity
    .configure()
    .initialState('proposé')
      .on('APPROVE').transitionTo('validé')
      .on('REJECT').transitionTo('rejeté')
    
    .state('validé')
      .onEnter(async () => {
        console.log(` Post ${post._id} approved`);
        await notificationService.createNotification(
          post.author._id,
          'Votre proposition a été validée.',
          'post'
        );
      })
    
    .state('rejeté')
      .onEnter(async () => {
        console.log(`❌ Post ${post._id} rejected`);
        await notificationService.createNotification(
          post.author._id,
          'Votre proposition a été rejetée.',
          'post'
        );
      })
    
    .global()
      .onStateEnter((state) => {
        console.log(`📝 Post ${post._id} entered state: ${state}`);
      })
      .onStateChange(async (from, to) => {
        console.log(`🔄 Post ${post._id}: ${from} → ${to}`);
        // Update database
        await repository.updatePostStatus(post._id, to);
      })
    
    .start();
};

export const createReportStateMachine = (report, repository) => {
  return Finity
    .configure()
    .initialState('en attente')
      .on('APPROVE').transitionTo('validé')
      .on('REJECT').transitionTo('rejeté')
    
    .state('validé')
      .onEnter(async () => {
        console.log(` Report ${report._id} validated`);
        await notificationService.createNotification(
          report.reporter._id,
          'Votre signalement a été validé.',
          'report'
        );
        await repository.updateReportStatus(report._id, 'validé');
        
      })
    
    .state('rejeté')
      .onEnter(async () => {
        console.log(`❌ Report ${report._id} rejected`);
        await notificationService.createNotification(
          report.reporter._id,
          'Votre signalement a été rejeté.',
          'report'
        );
        await repository.updateReportStatus(report._id, 'rejeté');
        // remove post
      })
    
    .global()
      .onStateChange((from, to) => {
        console.log(`🔄 Report ${report._id}: ${from} → ${to}`);
      })
    
    .start();
};