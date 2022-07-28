export const emailsStyle = () => {
  const style = `<style>
      img {
        border: none;
      }

      body {
        background-color: #ffffff;
        font-family: Calibri;
        font-size: 18px;
        line-height: 1.8;
        margin: 0;
        padding: 0;
      }

      table {
        width: 100%;
      }

      .main_container {
        display: block;
        margin: 0 auto;
        max-width: 580px;
        padding:30px 30px 0 30px;
        width: 580px;
      }

      .content {
        box-sizing: border-box;
        display: block;
        margin: 0 auto;
        max-width: 580px;
        padding: 20px 20px 0 20px;
      }

      p {
        font-size: 18px;
        font-weight: normal;
        margin: 5px 0;
      }

      h1 {
        font-size: 22px;
        margin-bottom: 20px;
      }

      .tr_img {
        padding: 15px 0 ;
      }

      a {
        color: #000000;
        text-decoration: underline;
        font-size: 20px;
        font-weight: bold;
        padding: 15px 0 ;
      }

      a:hover {
        color: #E02735;
        cursor: pointer;
      }

      .p_strong {
        font-weight: 600;
      }
      span {
      font-size: 14px;
      margin-top: 20px;
      }

      @media only screen and (max-width: 620px) {
        table.body h1 {
          font-size: 28px !important;
          margin-bottom: 10px !important;
        }

        table.body p,
        table.body td {
          font-size: 16px;
        }

        a {
          font-size: 18px;
        }

        table.body .content {
          padding: 0;
        }

        table.body .main_container {
          padding: 0;
          width: 100%;
        }

        table.body .main {
          border-left-width: 0;
          border-radius: 0;
          border-right-width: 0;
        }
      }
    </style>`
  return style;
};
