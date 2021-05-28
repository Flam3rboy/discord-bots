module.exports.run = async function(message, args, conf) {
	switch (args[0]) {
		case undefined:
			message.channel.send({
				embed: {
					color: 0x808080,
					title: "Ban: Fehler! Hilfe:",
					description: this.help.help
				}
			});
			break;
		default:
			if (message.mentions.users.array().length <= 0) {
				message.channel.send({
					embed: {
						color: 0x808080,
						title: "Fehler beim Bannen",
						description: args.join(" ") + " nicht gefunden!"
					}
				});
			} else {
				var user = client.guilds
					.first()
					.members.find(
						x => x.user.id == message.mentions.users.first().id
					);

				var error = false;

				user.ban()
					.then(x => {
						if (error == false) {
							message.channel.send({
								embed: {
									color: 0x808080,
									title:
										"Der User " +
										user.user.username +
										" wurde gebannt",
									description: "<@" + user.user.id + ">"
								}
							});
						}
					})
					.catch(e => {
						error = true;
						message.channel.send({
							embed: {
								color: 0x808080,
								title: "Fehler beim Bannen",
								description:
									args[0] +
									" konnte nicht gebannt werden\nFehler: " +
									e.message
							}
						});
					});
				console.log("Ban: " + user.user.id + " " + user.user.username);
			}
			break;
	}
};

module.exports.help = {
	name: "ban",
	description: "Bans a user",
	help: "``ban [user]``"
};
