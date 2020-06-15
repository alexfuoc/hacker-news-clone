import React from "react";
import { Link } from "react-router-dom";
import { ThemeConsumer } from "../contexts/theme";
import { dateConverter } from "../utils/helpers";

export default function MetaInfo({ user, time, id, comments }) {

  return (
    <ThemeConsumer>
      {({ theme }) => (
        <div className={`meta-info-${theme}`}>
          <span>
            by{" "}
            {
              <Link
                className=""
                to={{
                  pathname: "/user",
                  search: `?id=${user}`,
                }}
              >
                {user}
              </Link>
            }{" "}
          </span>
          <span>at {dateConverter(time)} </span>
          {comments >= 0 && (
            <span>
              with{" "}
              {
                <Link
                  className=""
                  to={{
                    pathname: "/post",
                    search: `?id=${id}`,
                  }}
                >
                  {comments}
                </Link>
              }{" "}
              comments
            </span>
          )}
        </div>
      )}
    </ThemeConsumer>
  );
}