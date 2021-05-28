global.messages = [];

module.exports.init = () => {
	setInterval(() => {
		messages = [];
	}, 15000);
};

module.exports.check = message => {
	var sender = message.member;

	if (sender != undefined) {
		var roles = sender.roles.filter(
			x =>
				x.id != "511915484371746817" &&
				x.id != "568540078343716888" &&
				x.id != "511915434157670429" &&
				x.id != "547775861538029578" &&
				x.id != "564810105531531284" &&
				x.id != "562308764800122917" &&
				x.id != "568784491032608778" &&
				x.id != "538428937290907668"
		);

		try {
			if (
				roles == undefined &&
				message.channel.id != "560178606291288074" &&
				sender.hasPermission(8192) == false &&
				sender.user.bot == false
			) {
				var m = message.content.split(" ");
				var CapsGesamt = 0;
				var spam = false;

				messages.push(message.author.id);

				//CAPS
				m.forEach(e => {
					for (var j = 0; j < e.length; j++) {
						var c = e.charAt(j);
						if (c != c.toLowerCase()) {
							CapsGesamt++;
						}
					}
				});
				if (CapsGesamt / m.length > 2) {
					sender.user
						.send({
							embed: {
								color: 0x808080,
								title: "Spam: Caps",
								thumbnail: {
									url: client.user.avatarURL
								},
								description:
									"Bitte Spamme kein Caps\n1 extra Warnpoint"
							}
						})
						.catch(e => {});
					spam = true;
				}

				//Bad Words
				var similarityPercent = 0.99;
				var badword = false;
				m.forEach(e => {
					if (
						badwords.find(x => {
							return (
								x.toLowerCase() == e ||
								similarity(e, x.toLowerCase()) >
									similarityPercent
							);
						}) != undefined
					) {
						badword = e;
					}
				});

				if (
					badwords.find(x => {
						return (
							x.toLowerCase() == m.join(" ") ||
							similarity(m.join(" "), x.toLowerCase()) >
								similarityPercent
						);
					}) != undefined
				) {
					badword =
						m.join(" ") +
						"/" +
						badwords.find(x => {
							return (
								x.toLowerCase() == m.join(" ") ||
								similarity(m.join(" "), x.toLowerCase()) >
									similarityPercent
							);
						});
				}

				if (badword != false) {
					sender.user
						.send({
							embed: {
								color: 0x808080,
								title: "Schimpfwort: " + badword,
								thumbnail: {
									url: client.user.avatarURL
								},
								description:
									"Bitte schicke keine Schimpfwörter\n1 extra Warnpoint"
							}
						})
						.catch(e => {});
					spam = true;
				}

				//LINK
				if (
					new RegExp(
						"([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?"
					).test(message.content)
				) {
					sender.user
						.send({
							embed: {
								color: 0x808080,
								title: "Spam: Link",
								thumbnail: {
									url: client.user.avatarURL
								},
								description:
									"Bitte schicke keine Links\n1 extra Warnpoint"
							}
						})
						.catch(e => {});
					spam = true;
				}

				//SPAM
				if (messages.filter(x => x == message.author.id).length > 5) {
					sender.user
						.send({
							embed: {
								color: 0x808080,
								title: "Spam",
								thumbnail: {
									url: client.user.avatarURL
								},
								description:
									"Du sendest zu viele Nachrichten!\n1 extra Warnpoint"
							}
						})
						.catch(e => {});
					spam = true;
				}

				if (spam == true) {
					client.commands.get("warn").warn(message.member);
					console.log("Spam: " + sender.user.tag);
					message.delete().catch(e => console.error(e));
					return true;
				}
			}
		} catch (e) {
			console.error(e);
		}
	}
	return false;
};

global.similarity = function(s1, s2) {
	var longer = s1;
	var shorter = s2;
	if (s1.length < s2.length) {
		longer = s2;
		shorter = s1;
	}
	var longerLength = longer.length;
	if (longerLength == 0) {
		return 1.0;
	}
	return (
		(longerLength - editDistance(longer, shorter)) /
		parseFloat(longerLength)
	);
};

global.editDistance = function(s1, s2) {
	s1 = s1.toLowerCase();
	s2 = s2.toLowerCase();

	var costs = new Array();
	for (var i = 0; i <= s1.length; i++) {
		var lastValue = i;
		for (var j = 0; j <= s2.length; j++) {
			if (i == 0) costs[j] = j;
			else {
				if (j > 0) {
					var newValue = costs[j - 1];
					if (s1.charAt(i - 1) != s2.charAt(j - 1))
						newValue =
							Math.min(Math.min(newValue, lastValue), costs[j]) +
							1;
					costs[j - 1] = lastValue;
					lastValue = newValue;
				}
			}
		}
		if (i > 0) costs[s2.length] = lastValue;
	}
	return costs[s2.length];
};
