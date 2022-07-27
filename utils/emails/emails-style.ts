export const emailsStyle = () => {
    const style = `<style>

      img {
        border: none;
        -ms-interpolation-mode: bicubic;
        margin: 20px auto;
      }
      
      .tr_img {
       padding: 20px 0;
      }
      
      body {
        background-color: #f6f6f6;
        font-family: Calibri;
        -webkit-font-smoothing: antialiased;
        font-size: 18px;
        line-height: 1.9;
        margin: 0;
        padding: 0;
        -ms-text-size-adjust: 100%;
        -webkit-text-size-adjust: 100%; 
      }
      
      table {
        border-collapse: separate;
        width: 100%; 
      }
        
        table td {
          font-family: sans-serif;
          font-size: 18px;
          vertical-align: top; 
      }
      
      .body {
        background-color: #f6f6f6;
        width: 100%; 
      }
      
      .container {
        display: block;
        margin: 0 auto !important;
        max-width: 580px;
        padding: 10px;
        width: 580px; 
      }
      
      .content {
        box-sizing: border-box;
        display: block;
        margin: 0 auto;
        max-width: 580px;
        padding: 10px; 
      }
      
      .main {
        background: #ffffff;
        border-radius: 3px;
        width: 100%; 
      }
      
      .wrapper {
        box-sizing: border-box;
        padding: 20px; 
      }
      
      .content-block {
        padding-bottom: 10px;
        padding-top: 10px;
      }
      
      .footer {
        clear: both;
        margin-top: 10px;
        text-align: center;
        width: 100%; 
      }
      
      .footer td,
      .footer p,
      .footer span,
      .footer a {
          color: #999999;
          font-size: 16px;
          text-align: center; 
      }

      h1,
      h2,
      h3,
      h4 {
        color: #000000;
        font-weight: 400;
        line-height: 1.8;
        margin: 0 0 30px; 
      }

      h1 {
        font-size: 30px;
        font-weight: 500;
        text-transform: capitalize; 
      }
      
      p,
      ul,
      ol {
        font-size: 16px;
        font-weight: normal;
        margin: 0 0 15px; 
      }
      
      p li,
      ul li,
      ol li {
          list-style-position: inside;
          margin-left: 5px; 
      }
      
      a {
        color: #999999;
        text-decoration: underline; 
      }
      
      .btn {
        box-sizing: border-box;
        width: 100%; 
      }
        
       .btn > tbody > tr > td {
          padding-bottom: 15px; 
      }
      
       .btn table {
          width: auto; 
      }
      
       .btn table td {
          background-color: #cfcfcf;
          border-radius: 5px;
          text-align: center; 
      }
      
       .btn a {
          background-color: #cfcfcf;
          border: solid 1px #840000;;
          border-radius: 5px;
          box-sizing: border-box;
          color: rgba(255,0,0,0.57);
          cursor: pointer;
          display: inline-block;
          font-size: 14px;
          font-weight: bold;
          margin: 0;
          padding: 12px 25px;
          text-decoration: none;
          text-transform: capitalize; 
      }

      .btn-primary table td {
        background-color: #999999; 
      }

      .btn-primary a {
        background-color: #999999;
        border-color: #999999;
        color: #ffffff; 
      }

      @media only screen and (max-width: 620px) {
      
        table.body h1 {
          font-size: 28px !important;
          margin-bottom: 10px !important; 
        }
        
        table.body p,
        table.body ul,
        table.body ol,
        table.body td,
        table.body span,
        table.body a {
          font-size: 16px !important; 
        }
        
        table.body .wrapper,
        table.body .article {
          padding: 10px !important; 
        }
        
        table.body .content {
          padding: 0 !important; 
        }
        
        table.body .container {
          padding: 0 !important;
          width: 100% !important; 
        }
        
        table.body .main {
          border-left-width: 0 !important;
          border-radius: 0 !important;
          border-right-width: 0 !important; 
        }
        
        table.body .btn table {
          width: 100% !important; 
        }
        
        table.body .btn a {
          width: 100% !important; 
        }
        
        table.body .img-responsive {
          height: auto !important;
          max-width: 100% !important;
          width: auto !important; 
        }
      }
      
      @media all {
        .btn-primary table td:hover {
          background-color: #34495e !important; 
        }
        
        .btn-primary a:hover {
          background-color: #34495e !important;
          border-color: #34495e !important; 
        } 
      }
    </style>`;

    return style;
}