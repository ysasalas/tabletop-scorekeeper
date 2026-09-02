def _validate_start_config(players, winning_score):
    if not isinstance(players, list) or not 2 <= len(players) <= 8:
        raise ValueError("Dutch Blitz requires 2 to 8 players.")

    cleaned_players = [str(name).strip() for name in players]
    if any(not name for name in cleaned_players):
        raise ValueError("All players must have names.")

    if len(set(cleaned_players)) != len(cleaned_players):
        raise ValueError("Player names must be unique.")

    if not isinstance(winning_score, int) or winning_score <= 0:
        raise ValueError("Winning score must be a whole number greater than 0.")

    return cleaned_players, winning_score


def build_rankings(totals):
    ordered = sorted(totals.items(), key=lambda item: (-item[1], item[0]))
    return [
        {"rank": idx + 1, "name": player_name, "score": score}
        for idx, (player_name, score) in enumerate(ordered)
    ]


def start_game(players, winning_score):
    validated_players, validated_winning_score = _validate_start_config(players, winning_score)

    totals = {player_name: 0 for player_name in validated_players}

    return {
        "players": validated_players,
        "winning_score": validated_winning_score,
        "round_number": 1,
        "rounds": [],
        "totals": totals,
        "rankings": build_rankings(totals),
        "winner": None,
        "is_finished": False,
    }


def submit_round(state, round_scores):
    if state.get("is_finished"):
        raise ValueError("Cannot add scores to a finished game.")

    players = state["players"]
    totals = dict(state["totals"])
    round_values = {}

    for player_name in players:
        if player_name not in round_scores:
            raise ValueError("Scores are required for every player.")
        value = round_scores[player_name]
        if not isinstance(value, int):
            raise ValueError(f"Score for {player_name} must be a whole number.")

        round_values[player_name] = value
        totals[player_name] += value

    rounds = list(state["rounds"])
    rounds.append({"round": state["round_number"], "scores": round_values})

    rankings = build_rankings(totals)
    winners_above_target = {
        player_name: score
        for player_name, score in totals.items()
        if score >= state["winning_score"]
    }

    winner = None
    is_finished = False

    if winners_above_target:
        highest_score = max(winners_above_target.values())
        winners = [
            player_name
            for player_name, score in winners_above_target.items()
            if score == highest_score
        ]
        winner = {"winners": winners, "score": highest_score}
        is_finished = True

    show_standings = (not is_finished) and (len(rounds) % 5 == 0)

    next_state = {
        **state,
        "round_number": state["round_number"] + 1,
        "rounds": rounds,
        "totals": totals,
        "rankings": rankings,
        "winner": winner,
        "is_finished": is_finished,
    }

    return {
        "state": next_state,
        "events": {
            "show_standings": show_standings,
            "standings": rankings,
            "winner": winner,
        },
    }


def _read_positive_int(prompt):
    while True:
        try:
            value = int(input(prompt))
            if value > 0:
                return value
            print("Please enter a number greater than 0.")
        except ValueError:
            print("Please enter a valid whole number.")


def run_cli():
    num_players = _read_positive_int("Enter the number of players: ")

    player_names = []
    for idx in range(num_players):
        player_name = input(f"Enter the name of Player {idx + 1}: ").strip()
        while (not player_name) or (player_name in player_names):
            if not player_name:
                print("Player name is required.")
            else:
                print("That name is already taken.")
            player_name = input(f"Enter a different name for Player {idx + 1}: ").strip()
        player_names.append(player_name)
        print(f"Welcome, {player_name}!")

    winning_score = _read_positive_int("Enter the winning score: ")

    state = start_game(player_names, winning_score)

    while True:
        print(f"Round {state['round_number']}!")
        print(f"Current Scores: {state['totals']}")

        round_scores = {}
        for player_name in state["players"]:
            round_scores[player_name] = int(input(f"Enter the score for {player_name}: "))

        result = submit_round(state, round_scores)
        state = result["state"]

        if state["is_finished"]:
            winners = state["winner"]["winners"]
            score = state["winner"]["score"]
            if len(winners) > 1:
                print(f"It's a tie between {', '.join(winners)} with {score} points!")
            else:
                print(f"{winners[0]} wins with a score of {score}!")
            break

        if result["events"]["show_standings"]:
            leader = state["rankings"][0]
            print(f"{leader['name']} has the highest score of {leader['score']}!")
            print("\nCurrent Rankings:")
            for rank_entry in state["rankings"]:
                print(f"{rank_entry['rank']}. {rank_entry['name']}: {rank_entry['score']}")


if __name__ == "__main__":
    run_cli()