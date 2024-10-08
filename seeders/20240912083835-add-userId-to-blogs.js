'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Fetch all blog entries
    const blogs = await queryInterface.sequelize.query(
        'SELECT id FROM Blogs',
        { type: Sequelize.QueryTypes.SELECT }
    );

    // Fetch all user IDs
    const users = await queryInterface.sequelize.query(
        'SELECT id FROM Users',
        { type: Sequelize.QueryTypes.SELECT }
    );

    // Map user IDs to an array
    const userIds = users.map(user => user.id);

    // Update each blog entry with a random user ID
    for (const blog of blogs) {
      const randomUserId = userIds[Math.floor(Math.random() * userIds.length)];
      await queryInterface.bulkUpdate(
          'Blogs',
          { userId: randomUserId },
          { id: blog.id }
      );
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Optionally revert changes by setting userId to null or some default value
    await queryInterface.bulkUpdate('Blogs', { userId: null }, {});
  }
};
