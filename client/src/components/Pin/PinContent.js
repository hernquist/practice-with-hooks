import React, { useContext } from "react";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import AccessTime from "@material-ui/icons/AccessTime";
import Face from "@material-ui/icons/Face";
import Context from "../../context";
import format from "date-fns/format";

const PinContent = ({ classes }) => {
  const { state } = useContext(Context);
  const { title, content, author, createdAt, Comments } = state.currentPin;

  return (
    <div className={classes.root}>
      <Typography component="h2" variant="h4" gutterBottom color="primary">
        {title}
      </Typography>
      <Typography
        className={classes.name}
        component="h3"
        variant="h6"
        gutterBottom
        color="inherit"
      >
        <Face className={classes.icon} />
        {author.name}
      </Typography>
      <Typography
        className={classes.text}
        component="h3"
        variant="subtitle2"
        gutterBottom
        color="inherit"
      >
        <AccessTime className={classes.icon} />
        {format(createdAt, "MMM Do, YYYY")}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        {content}
      </Typography>
    </div>
  );
};

const styles = theme => ({
  root: {
    padding: "1em 0.5em",
    textAlign: "center",
    width: "100%"
  },
  icon: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  text: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }
});

export default withStyles(styles)(PinContent);
